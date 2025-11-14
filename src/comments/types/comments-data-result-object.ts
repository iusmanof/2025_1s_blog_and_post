type ICommentsInfo = {
  userId: string;
  userLogin: string;
};

export type commentsDataResultObject = {
  id: string;
  content: string;
  commentatorInfo: ICommentsInfo;
  createdAt: string;
};

export type commentsDBResultObject = {
  pagesCount?: number;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  items: commentsDataResultObject[];
};
