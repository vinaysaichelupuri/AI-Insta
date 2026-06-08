import { Request, Response, Router } from "express";
import { Post, GeneratedAsset } from "../models/Post";
import { User } from "../models/User";
import { InstagramService } from "../services/instagramService";
import { exportService } from "../services/exportService";

const router = Router();

router.post("/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["DRAFT", "RENDERING", "PENDING_REVIEW", "APPROVED", "PUBLISHED", "REJECTED", "FAILED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (status === "APPROVED") {
      // Trigger export automatically (T021)
      try {
        console.log(`Triggering export for post ${id} upon approval`);
        // In a real implementation we would fetch the rendered HTML slides for this post
        const dummyHtmlSlides = [
          '<html><body style="background: white;"><h1>Slide 1</h1></body></html>',
          '<html><body style="background: white;"><h1>Slide 2</h1></body></html>'
        ];
        
        const paths = await exportService.exportHtmlToImages(id, dummyHtmlSlides);
        
        // Save generated assets to db
        for (const p of paths) {
          await GeneratedAsset.create({
            postId: id,
            imagePath: p,
          });
        }
      } catch (e) {
        console.error("Export failed during approval", e);
      }
    }

    if (status === "REJECTED" || status === "DRAFT") {
      // Regenerate trigger logic
      // In a real implementation, this would trigger the content generation module
      console.log(`Triggering content generation for post ${id} due to 'regenerate'/'reject' status`);
    }

    res.status(200).json({ message: "Post status updated successfully", post });
  } catch (error) {
    console.error("Error updating post status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/export", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // In a real implementation we would fetch the rendered HTML slides for this post
    const dummyHtmlSlides = [
      '<html><body style="background: white;"><h1>Slide 1</h1></body></html>',
      '<html><body style="background: white;"><h1>Slide 2</h1></body></html>'
    ];
    
    const paths = await exportService.exportHtmlToImages(id, dummyHtmlSlides);
    
    // Save generated assets to db
    for (const p of paths) {
      await GeneratedAsset.create({
        postId: id,
        imagePath: p,
      });
    }

    res.status(200).json({ message: "Export completed successfully", paths });
  } catch (error) {
    console.error("Error during export:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/publish", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.status !== "APPROVED") {
      return res.status(400).json({ error: "Post must be APPROVED before publishing" });
    }

    // For simplicity, we are getting a dummy user, or we'd get it from req.user (auth middleware)
    const user = await User.findOne();
    if (!user || !user.instagramAccessToken || !user.instagramAccountId) {
      return res.status(400).json({ error: "Instagram account not linked" });
    }

    const instagramService = new InstagramService(user.instagramAccessToken, user.instagramAccountId);
    
    // In a full implementation, we'd fetch the generated assets URLs
    const dummyImageUrls = [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ];

    await instagramService.publishCarousel(dummyImageUrls, post.caption || "");

    post.status = "PUBLISHED";
    post.publishedAt = new Date();
    await post.save();

    res.status(200).json({ message: "Post published successfully", post });
  } catch (error) {
    console.error("Error publishing post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { topic, status } = req.query;
    
    // Build query object
    const query: any = {};
    if (topic && typeof topic === 'string') {
      // Basic text search using regex for simplicity
      query.topic = { $regex: topic, $options: 'i' };
    }
    if (status && typeof status === 'string') {
      query.status = status;
    }

    // Fetch posts sorted by newest first
    const posts = await Post.find(query).sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
