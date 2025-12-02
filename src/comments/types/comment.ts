export interface ICommentatorInfo {
  userId: string;
  userLogin: string;
}

export interface ILikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
}

export interface Comment {
  content: string;
  commentatorInfo: ICommentatorInfo;
  likesInfo: ILikesInfo;
  createdAt: string;
}
