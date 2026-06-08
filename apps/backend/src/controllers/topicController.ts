import { Request, Response } from "express";
import { Post } from "../models/Post";
import { triggerGeneration } from "../services/agentService";

export const submitTopic = async (req: Request, res: Response) => {
  try {
    const { topic, confirmDuplicate } = req.body;

    if (!topic || typeof topic !== "string" || topic.trim() === "") {
      res.status(400).json({ error: "ValidationError", message: "Topic is required." });
      return;
    }

    if (topic.length > 200) {
      res.status(400).json({ error: "ValidationError", message: "Topic must be under 200 characters." });
      return;
    }

    // Duplicate check
    const existingPost = await Post.findOne({ topic: { $regex: new RegExp(`^${topic}$`, "i") } });
    if (existingPost && !confirmDuplicate) {
      res.status(409).json({
        error: "DuplicateTopic",
        message: "You have already generated content for this topic. Proceed anyway?",
        requiresConfirmation: true,
      });
      return;
    }

    const newPost = new Post({ topic });
    await newPost.save();

    // Trigger asynchronous generation
    triggerGeneration(topic, newPost._id.toString()).catch((err) => {
      console.error("Failed to trigger generation:", err);
    });

    res.status(201).json({
      id: newPost._id,
      topic: newPost.topic,
      status: newPost.status,
      createdAt: newPost.createdAt,
    });
  } catch (error) {
    console.error("Error submitting topic:", error);
    res.status(500).json({ error: "ServerError", message: "An internal error occurred." });
  }
};
