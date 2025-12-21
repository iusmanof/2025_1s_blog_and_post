import { Types } from "mongoose";

export enum LikeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export interface ILikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
}

export interface ICommentReaction {
  userId: string;
  commentId: Types.ObjectId;
  status: LikeStatus;
}
