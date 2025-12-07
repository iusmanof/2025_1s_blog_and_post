import { ObjectId } from "mongodb";
import { ILikesInfo } from "./like";

export interface ICommentatorInfo {
  userId: string;
  userLogin: string;
}

export interface Comment {
  id: string;
  postId: ObjectId;
  content: string;
  commentatorInfo: ICommentatorInfo;
  likesInfo: ILikesInfo;
  createdAt: string;
}
