import mongoose from "mongoose";

export type Post = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: mongoose.Types.ObjectId;
};


export interface PostRequestBody {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    // TODO
    extendedLikesInfo?: any;
}


export type PostRequestInBlogBody = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: mongoose.Types.ObjectId;
    blogName: string;
}