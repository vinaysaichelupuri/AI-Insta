import { Request, Response, Router } from "express";
import { Post, Slide, GeneratedAsset } from "../models/Post";
import { InstagramService } from "../services/instagramService";
import { exportService } from "../services/exportService";
import { resolveRequestUser } from "../utils/authUser";

const router = Router();

// GET /api/posts - list posts with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const { topic, status } = req.query;
    const query: any = {};
    if (topic && typeof topic === "string") {
      query.topic = { $regex: topic, $options: "i" };
    }
    if (status && typeof status === "string") {
      query.status = status;
    }
    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/posts/:id - get single post by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json({ post });
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/posts/:id/slides - get all slides for a post
router.get("/:id/slides", async (req: Request, res: Response) => {
  try {
    const slides = await Slide.find({ postId: req.params.id }).sort({ slideNumber: 1 });
    res.status(200).json({ slides });
  } catch (error) {
    console.error("Error retrieving slides:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/posts/:id/status - update post status
router.post("/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["DRAFT", "RENDERING", "PENDING_REVIEW", "APPROVED", "PUBLISHED", "REJECTED", "FAILED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const post = await Post.findByIdAndUpdate(id, { status }, { new: true });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (status === "APPROVED") {
      try {
        const slides = await Slide.find({ postId: id }).sort({ slideNumber: 1 });
        console.log(`Post ${id} approved. Has ${slides.length} rendered slides.`);
      } catch (e) {
        console.error("Slide check failed during approval", e);
      }
    }

    res.status(200).json({ message: "Post status updated successfully", post });
  } catch (error) {
    console.error("Error updating post status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/posts/:id/export - export HTML slides to images
router.post("/:id/export", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const dummyHtmlSlides = [
      '<html><body style="background: white;"><h1>Slide 1</h1></body></html>',
      '<html><body style="background: white;"><h1>Slide 2</h1></body></html>'
    ];
    
    const paths = await exportService.exportHtmlToImages(id, dummyHtmlSlides);
    
    for (const p of paths) {
      await GeneratedAsset.create({ postId: id, imagePath: p });
    }

    res.status(200).json({ message: "Export completed successfully", paths });
  } catch (error) {
    console.error("Error during export:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/posts/:id/publish - publish post to Instagram
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

    const user = await resolveRequestUser(req);
    if (!user || !user.instagramAccessToken || !user.instagramAccountId) {
      return res.status(400).json({ error: "Instagram account not linked. Please configure Instagram credentials." });
    }

    const instagramService = new InstagramService(user.instagramAccessToken, user.instagramAccountId);
    
    // Fetch real generated asset URLs
    const assets = await GeneratedAsset.find({ postId: id });
    const baseUrl = process.env.BASE_URL || "http://localhost:4000";
    const imageUrls = assets.map(a => {
      const assetPart = a.imagePath.split("assets/").pop();
      return `${baseUrl}/assets/${assetPart}`;
    });
    
    if (imageUrls.length === 0) {
      return res.status(400).json({ error: "No images found for this post. Run export first." });
    }

    await instagramService.publishCarousel(imageUrls, post.caption || "");

    post.status = "PUBLISHED";
    post.publishedAt = new Date();
    await post.save();

    res.status(200).json({ message: "Post published successfully", post });
  } catch (error) {
    console.error("Error publishing post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
