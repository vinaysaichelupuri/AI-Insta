import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import topicRoutes from "./routes/topicRoutes";
import loginRoutes from "./routes/auth";          // real login handler
import instagramAuthRoutes from "./routes/authRoutes"; // instagram token handler
import postRoutes from "./routes/postRoutes";
import deviceRoutes from "./routes/deviceRoutes";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

import path from "path";
// Serve generated images — resolves to <backend-root>/assets/
const ASSETS_DIR = path.join(process.cwd(), "assets");
app.use("/assets", express.static(ASSETS_DIR));


app.use("/api/topics", topicRoutes);
app.use("/api/auth", loginRoutes);                // POST /api/auth/login
app.use("/api/auth", instagramAuthRoutes);        // POST /api/auth/instagram/token
app.use("/api/posts", postRoutes);
app.use("/api/devices", deviceRoutes);            // POST /api/devices/register (mobile push tokens)

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "AI-Integration backend is running.",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "@ai-integration/backend",
    timestamp: new Date().toISOString(),
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ai-insta")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
