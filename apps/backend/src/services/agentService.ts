import { generateCarousel } from "./geminiService";
import { exportSlidesToPng } from "./renderService";
import { Post, Slide, GeneratedAsset } from "../models/Post";

export const triggerGeneration = async (topic: string, postId: string) => {
  console.log(`[AgentService] Starting content generation for topic: "${topic}" (Post ID: ${postId})`);
  
  try {
    // 1. Update Post Status
    await Post.findByIdAndUpdate(postId, { status: "RENDERING" });

    // 2. Generate Text Content (with retries for transient failures)
    let generatedContent;
    let attempts = 0;
    while (attempts < 3) {
      try {
        generatedContent = await generateCarousel(topic);
        break; // Success
      } catch (err) {
        attempts++;
        console.error(`[AgentService] Gemini API failure (Attempt ${attempts}/3):`, err);
        if (attempts >= 3) throw new Error("Gemini generation failed after 3 attempts");
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retry
      }
    }

    if (!generatedContent) throw new Error("No content generated");

    // 3. Persist Slides
    const slideDocs = [];
    for (const slideData of generatedContent.slides) {
      const slide = new Slide({
        postId,
        slideNumber: slideData.slideNumber,
        title: slideData.title,
        content: slideData.content,
        templateType: slideData.templateType,
      });
      await slide.save();
      slideDocs.push(slide);
    }

    // 4. Update Post with Caption
    await Post.findByIdAndUpdate(postId, { 
      caption: generatedContent.caption,
      hashtags: generatedContent.hashtags 
    });

    // 5. Render Carousel Images
    const imagePaths = await exportSlidesToPng(slideDocs, postId);

    // 6. Persist Generated Assets
    for (const path of imagePaths) {
      const asset = new GeneratedAsset({
        postId,
        imagePath: path
      });
      await asset.save();
    }

    // 7. Update final status
    await Post.findByIdAndUpdate(postId, { status: "PENDING_REVIEW" });
    console.log(`[AgentService] Pipeline completed successfully for post ${postId}`);

  } catch (error) {
    console.error(`[AgentService] Pipeline failed for post ${postId}:`, error);
    await Post.findByIdAndUpdate(postId, { status: "FAILED" });
  }
};
