import { generateCarousel } from "./geminiService";
import { exportSlidesToPng } from "./renderService";
import { Post, Slide, GeneratedAsset } from "../models/Post";

// Parses the retryDelay from a Gemini 429 error (e.g. "36s" → 36000ms)
const getRetryDelayMs = (err: any): number => {
  try {
    const body = typeof err.message === "string" ? JSON.parse(err.message) : err;
    const retryInfo = body?.error?.details?.find(
      (d: any) => d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
    );
    if (retryInfo?.retryDelay) {
      const seconds = parseFloat(retryInfo.retryDelay.replace("s", ""));
      return Math.ceil(seconds) * 1000;
    }
  } catch {}
  return 5000; // default 5s fallback
};

// Returns true if this is a daily quota exhaustion (not just a rate-limit burst)
const isDailyQuotaExhausted = (err: any): boolean => {
  try {
    const body = typeof err.message === "string" ? JSON.parse(err.message) : err;
    const violations = body?.error?.details?.find(
      (d: any) => d["@type"] === "type.googleapis.com/google.rpc.QuotaFailure"
    )?.violations ?? [];
    return violations.some((v: any) =>
      v.quotaId?.toLowerCase().includes("perday") ||
      v.quotaId?.toLowerCase().includes("per_day")
    );
  } catch {}
  return false;
};

export const triggerGeneration = async (topic: string, postId: string) => {
  console.log(`[AgentService] Starting content generation for topic: "${topic}" (Post ID: ${postId})`);
  
  try {
    // 1. Update Post Status
    await Post.findByIdAndUpdate(postId, { status: "RENDERING" });

    // 2. Generate Text Content — respects retry-delay from API, skips if daily quota gone
    let generatedContent;
    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        generatedContent = await generateCarousel(topic);
        break; // Success
      } catch (err: any) {
        const isQuotaError = err?.status === 429 || err?.message?.includes('"code":429');
        const isDaily = isDailyQuotaExhausted(err);

        console.error(`[AgentService] Gemini API failure (Attempt ${attempt}/${MAX_ATTEMPTS}) [429=${isQuotaError}, daily=${isDaily}]`, err);

        if (isDaily) {
          // Daily quota exhausted — no point retrying today
          throw new Error(
            "QUOTA_EXHAUSTED: Your Gemini free-tier daily quota (20 requests/day) is used up. " +
            "Please wait until midnight (UTC) for it to reset, or add a paid API key."
          );
        }

        if (attempt >= MAX_ATTEMPTS) {
          throw new Error(`Gemini generation failed after ${MAX_ATTEMPTS} attempts`);
        }

        if (isQuotaError) {
          // Respect the API's requested retry delay
          const delayMs = getRetryDelayMs(err);
          console.log(`[AgentService] Rate-limited. Waiting ${delayMs / 1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        } else {
          // Transient error — short backoff
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
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
      const asset = new GeneratedAsset({ postId, imagePath: path });
      await asset.save();
    }

    // 7. Update final status
    await Post.findByIdAndUpdate(postId, { status: "PENDING_REVIEW" });
    console.log(`[AgentService] Pipeline completed successfully for post ${postId}`);

  } catch (error: any) {
    const isQuotaError = error?.message?.startsWith("QUOTA_EXHAUSTED");
    console.error(`[AgentService] Pipeline failed for post ${postId}:`, 
      isQuotaError ? error.message : error
    );
    await Post.findByIdAndUpdate(postId, {
      status: "FAILED",
      ...(isQuotaError ? { failReason: error.message } : {})
    });
  }
};
