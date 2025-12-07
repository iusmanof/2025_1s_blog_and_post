type CommentDTO = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};

type CommentsResponseDTO = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentDTO[];
};
