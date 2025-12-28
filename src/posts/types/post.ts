import mongoose from "mongoose";

export type Post = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: mongoose.Types.ObjectId;
  blogName: string;
};

export interface PostRequestBody {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
}
