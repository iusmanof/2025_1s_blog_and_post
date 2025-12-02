import mongoose from "mongoose";

export type Post = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: mongoose.Types.ObjectId;
};
