import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  topic: string;
  status: "PENDING" | "GENERATING" | "REVIEW" | "PUBLISHED" | "FAILED";
  createdAt: Date;
  publishedAt?: Date;
  caption?: string;
  hashtags?: string[];
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
  caption: { type: String },
  hashtags: [{ type: String }],
});

export const Post = mongoose.model<IPost>("Post", PostSchema);

export interface ISlide extends Document {
  postId: mongoose.Types.ObjectId;
  slideNumber: number;
  title: string;
  content: string;
  templateType: "Cover" | "Definition" | "Fact" | "CTA" | "Concept" | "Example";
}

const SlideSchema = new Schema<ISlide>({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  slideNumber: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  templateType: {
    type: String,
    enum: ["Cover", "Definition", "Fact", "CTA", "Concept", "Example"],
    required: true,
  },
});

export const Slide = mongoose.model<ISlide>("Slide", SlideSchema);

export interface IGeneratedAsset extends Document {
  postId: mongoose.Types.ObjectId;
  imagePath: string;
  createdAt: Date;
}

const GeneratedAssetSchema = new Schema<IGeneratedAsset>({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  imagePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const GeneratedAsset = mongoose.model<IGeneratedAsset>("GeneratedAsset", GeneratedAssetSchema);
