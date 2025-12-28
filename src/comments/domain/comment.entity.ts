type CommentEntityTypes = {
  userId: string;
  postId: string;
  content: string;
};

export class CommentEntity {
  private userId: string;
  private postId: string;
  private content: string;

  constructor(params: CommentEntityTypes) {
    this.userId = params.userId;
    this.postId = params.postId;
    this.content = params.content;
  }

  getUserId(): string {
    return this.userId;
  }

  getPostId(): string {
    return this.postId;
  }

  getContent(): string {
    return this.content;
  }
}
