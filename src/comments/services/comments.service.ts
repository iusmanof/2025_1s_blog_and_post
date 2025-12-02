import { inject, injectable } from "inversify";
import { ResultObject, resultStatus } from "../../core/types/result-object";
import {
  commentsDataResultObject,
  commentsDBResultObject,
} from "../types/comments-data-result-object";
import { CommentsQuery } from "../types/comments-query";
import { CommentsRepository } from "../repositories/comments.repository";
import { CommentHydrateDocument } from "../domain/comments.entiry";

@injectable()
class CommentsService {
  constructor(
    @inject(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
  ) {}
  async create(
    userId: string,
    postId: string,
    content: string,
  ): Promise<ResultObject<CommentHydrateDocument | null>> {
    const commentsInfo = await this.commentsRepository.create(
      userId,
      postId,
      content,
    );

    if (!commentsInfo) {
      return {
        status: resultStatus.ERROR,
        errorMessages: "Failed to create a comment",
        data: null,
        extensions: [],
      };
    }
    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: commentsInfo,
    };
  }
  async getCommentByPostId(
    postId: string,
    query: CommentsQuery,
  ): Promise<ResultObject<commentsDBResultObject | null>> {
    const comments = await this.commentsRepository.getCommentsByPostId(
      postId,
      query,
    );
    if (!comments) {
      return {
        status: resultStatus.ERROR,
        errorMessages: "Comments not found",
        data: null,
        extensions: [],
      };
    }
    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: comments,
    };
  }
  async getByCommentId(
    commentId: string,
  ): Promise<ResultObject<commentsDataResultObject | null>> {
    const comment = await this.commentsRepository.getCommentById(commentId);
    if (!comment) {
      return {
        status: resultStatus.NOT_FOUND,
        errorMessages: "Failed to get a comment",
        data: null,
        extensions: [],
      };
    }

    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: comment,
    };
  }
  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<ResultObject<commentsDataResultObject | null>> {
    const comment = await this.commentsRepository.getCommentById(commentId);
    if (!comment) {
      return {
        status: resultStatus.NOT_FOUND,
        errorMessages: "Failed to get a comment",
        data: null,
        extensions: [],
      };
    }

    if (comment.commentatorInfo.userId !== userId) {
      return {
        status: resultStatus.ERROR,
        errorMessages: "UserId not found",
        data: null,
        extensions: [],
      };
    }

    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: comment,
    };
  }
  async deleteById(commentId: string): Promise<ResultObject<{} | null>> {
    const result = await this.commentsRepository.deleteById(commentId);
    if (!result) {
      return {
        status: resultStatus.ERROR,
        errorMessages: "Failed to delete a comment",
        data: null,
        extensions: [],
      };
    }

    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: result,
    };
  }
  async updateById(
    commentId: string,
    content: string,
  ): Promise<ResultObject<{} | null>> {
    const result = await this.commentsRepository.updateById(commentId, content);

    if (!result) {
      return {
        status: resultStatus.ERROR,
        errorMessages: "Failed to update a comment",
        data: null,
        extensions: [],
      };
    }
    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: result,
    };
  }
}

export default CommentsService;
