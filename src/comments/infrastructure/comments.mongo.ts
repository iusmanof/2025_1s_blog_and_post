import { Comment, ICommentatorInfo } from "../types/comment";
import mongoose, { HydratedDocument, model, Model, Schema } from "mongoose";
import { ICommentReaction, ILikesInfo } from "../types/like";

export type CommentHydrateDocument = HydratedDocument<Comment>;

type CommentModel = Model<Comment>;

export const commentatorInfoSchema = new mongoose.Schema<ICommentatorInfo>(
  {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  { _id: false },
);

export const likeInfoSchema = new mongoose.Schema<ILikesInfo>(
  {
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
  },
  { _id: false },
);

const commentSchema = new mongoose.Schema<Comment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    commentatorInfo: { type: commentatorInfoSchema, required: true },
    likesInfo: { type: likeInfoSchema, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const commentReactionSchema = new mongoose.Schema<ICommentReaction>(
  {
    userId: { type: String, required: true },
    commentId: { type: Schema.Types.ObjectId, ref: "comment", required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);
commentReactionSchema.index({ userId: 1, commentId: 1 }, { unique: true });

export const CommentReactionModel = model(
  "commentReaction",
  commentReactionSchema,
);

export const CommentMongooseModel = model<Comment, CommentModel>(
  "comment",
  commentSchema,
);
