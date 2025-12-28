import mongoose, { Document, Schema, model } from "mongoose";
import { ILikesInfo, ICommentReaction } from "../types/like";

export interface IComment {
  postId: string;
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  likesInfo: ILikesInfo & { myStatus?: string };
  createdAt: string;
}

export interface CommentDocument extends IComment, Document {
  updateReaction(currentStatus: string, newStatus: string): void;
  setMyStatus(status: string): void;
}

export interface CommentModel extends mongoose.Model<CommentDocument> {
  createFromEntity(entity: {
    userId: string;
    postId: string;
    content: string;
    userLogin: string;
  }): Promise<CommentDocument>;
}

const commentSchema = new Schema<CommentDocument>(
  {
    postId: { type: String, required: true },
    content: { type: String, required: true },
    commentatorInfo: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
    likesInfo: {
      likesCount: { type: Number, required: true, default: 0 },
      dislikesCount: { type: Number, required: true, default: 0 },
      myStatus: { type: String, default: "None" },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

commentSchema.methods.updateReaction = function (
  currentStatus: string,
  newStatus: string,
) {
  if (currentStatus === newStatus) return;

  if (currentStatus === "Like" && this.likesInfo.likesCount > 0)
    this.likesInfo.likesCount--;
  if (currentStatus === "Dislike" && this.likesInfo.dislikesCount > 0)
    this.likesInfo.dislikesCount--;

  if (newStatus === "Like") this.likesInfo.likesCount++;
  if (newStatus === "Dislike") this.likesInfo.dislikesCount++;

  this.likesInfo.myStatus = newStatus;
};

commentSchema.methods.setMyStatus = function (status: string) {
  this.likesInfo.myStatus = status;
};

commentSchema.statics.createFromEntity = async function (entity: {
  userId: string;
  postId: string;
  content: string;
  userLogin: string;
}) {
  const comment = new this({
    postId: entity.postId,
    content: entity.content,
    commentatorInfo: { userId: entity.userId, userLogin: entity.userLogin },
    likesInfo: { likesCount: 0, dislikesCount: 0, myStatus: "None" },
  });
  await comment.save();
  return comment;
};

const commentReactionSchema = new Schema<ICommentReaction>(
  {
    userId: { type: String, required: true },
    commentId: { type: Schema.Types.ObjectId, ref: "comment", required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

commentReactionSchema.index({ userId: 1, commentId: 1 }, { unique: true });

export const CommentReactionModel = model<ICommentReaction>(
  "commentReaction",
  commentReactionSchema,
);
export const CommentMongooseModel = model<CommentDocument, CommentModel>(
  "comment",
  commentSchema,
);
