import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { Post } from "../types/post";

export type PostHydrateDocument = HydratedDocument<Post>;
type PostModel = Model<Post>;

const postSchema = new mongoose.Schema<Post>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
      required: true,
    },
  },
  { timestamps: true },
);

export const PostMongooseModel = model<Post, PostModel>("post", postSchema);
