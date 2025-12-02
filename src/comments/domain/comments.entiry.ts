import { Comment, ICommentatorInfo, ILikesInfo } from "../types/comment";
import mongoose, { HydratedDocument, model, Model } from "mongoose";

export type CommentHydrateDocument = HydratedDocument<Comment>;

type CommentModel = Model<Comment>;

export const commentatorInfoSchema = new mongoose.Schema<ICommentatorInfo>({
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
});

export const likeInfoSchema = new mongoose.Schema<ILikesInfo>({
  likesCount: { type: Number, required: true },
  dislikesCount: { type: Number, required: true },
  myStatus: { type: String, required: true },
});
const commentSchema = new mongoose.Schema<Comment>(
  {
    content: { type: String, required: true },
    commentatorInfo: { type: commentatorInfoSchema, required: true },
    likesInfo: { type: likeInfoSchema, required: true },
    createdAt: { type: String, required: true },
  },
  { timestamps: true },
);

export const CommentMongooseModel = model<Comment, CommentModel>(
  "comment",
  commentSchema,
);
