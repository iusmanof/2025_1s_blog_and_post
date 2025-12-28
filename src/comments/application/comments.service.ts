import { injectable, inject } from "inversify";
import { CommentsRepository } from "../infrastructure/comments.repository";
import { CommentEntity } from "../domain/comment.entity";
import { resultStatus } from "../../core/types/result-object";
import { LikeStatus } from "../types/like";
import { CommentsQuery } from "../types/comments-query";

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async create(userId: string, postId: string, content: string) {
    const commentEntity = new CommentEntity({ userId, postId, content });
    const comment = await this.commentsRepository.create(commentEntity);
    if (!comment)
      return {
        status: resultStatus.ERROR,
        errorMessages: "Failed to create comment",
        data: null,
        extensions: [],
      };
    comment.likesInfo.myStatus = LikeStatus.None;
    return { status: resultStatus.SUCCESS, data: comment, extensions: [] };
  }

  async getByCommentId(commentId: string, userId: string | null) {
    const comment = await this.commentsRepository.getCommentById(commentId);
    if (!comment) {
      return {
        status: resultStatus.NOT_FOUND,
        errorMessages: "Comment not found",
        data: null,
        extensions: [],
      };
    }

    let myStatus: LikeStatus = LikeStatus.None;
    if (userId) {
      const statusCurrentUser = await this.commentsRepository.getStatusByUserId(
        commentId,
        userId,
      );
      if (statusCurrentUser?.status) {
        myStatus =
          LikeStatus[statusCurrentUser.status as keyof typeof LikeStatus];
      }
    }

    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: { ...comment, likesInfo: { ...comment.likesInfo, myStatus } },
    };
  }

  async getCommentByPostId(
    postId: string,
    query: CommentsQuery,
    userId: string | null,
  ) {
    const page = await this.commentsRepository.getCommentsByPostId(
      postId,
      query,
    );
    if (!page)
      return {
        status: resultStatus.ERROR,
        errorMessages: "Comments not found",
        data: null,
        extensions: [],
      };

    for (const comment of page.items) {
      comment.likesInfo.myStatus = LikeStatus.None;
      if (userId) {
        const status = await this.commentsRepository.getStatusByUserId(
          comment.id,
          userId,
        );
        if (status?.status)
          comment.likesInfo.myStatus = status.status as LikeStatus;
      }
    }

    return { status: resultStatus.SUCCESS, data: page, extensions: [] };
  }

  async setLikeStatus(
    commentId: string,
    newLikeStatus: string,
    userId: string,
  ) {
    if (!(newLikeStatus in LikeStatus))
      return {
        status: resultStatus.ERROR,
        errorMessages: "Invalid status",
        data: null,
        extensions: [],
      };
    const comment = await this.commentsRepository.setLikeStatus(
      commentId,
      newLikeStatus,
      userId,
    );
    if (!comment)
      return {
        status: resultStatus.NOT_FOUND,
        errorMessages: "Comment not found",
        data: null,
        extensions: [],
      };
    return { status: resultStatus.SUCCESS, data: {}, extensions: [] };
  }

  async deleteById(commentId: string) {
    const result = await this.commentsRepository.deleteById(commentId);
    if (!result)
      return {
        status: resultStatus.ERROR,
        errorMessages: "Failed to delete",
        data: null,
        extensions: [],
      };
    return { status: resultStatus.SUCCESS, data: result, extensions: [] };
  }

  async updateById(commentId: string, content: string) {
    const result = await this.commentsRepository.updateById(commentId, content);
    if (!result)
      return {
        status: resultStatus.ERROR,
        errorMessages: "Failed to update",
        data: null,
        extensions: [],
      };
    return { status: resultStatus.SUCCESS, data: result, extensions: [] };
  }
}
