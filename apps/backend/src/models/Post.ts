import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  topic: string;
  status: "PENDING" | "GENERATING" | "REVIEW" | "PUBLISHED" | "FAILED";
  createdAt: Date;
  publishedAt?: Date;
}

const PostSchema = new Schema<IPost>({
  topic: { type: String, required: true, maxlength: 200 },
  status: {
    type: String,
    enum: ["PENDING", "GENERATING", "REVIEW", "PUBLISHED", "FAILED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
  publishedAt: { type: Date },
});

export const Post = mongoose.model<IPost>("Post", PostSchema);
