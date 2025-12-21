import { inject, injectable } from "inversify";
import { ResultObject, resultStatus } from "../../core/types/result-object";
import { CommentsQuery } from "../types/comments-query";
import { CommentsRepository } from "../infrastructure/comments.repository";
import { LikeStatus } from "../types/like";

@injectable()
class CommentsService {
  constructor(
    @inject(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async create(userId: string, postId: string, content: string) {
    const newComment = await this.commentsRepository.create(
      userId,
      postId,
      content,
    );

    if (!newComment) {
      return {
        status: resultStatus.ERROR,
        errorMessages: "Failed to create a comment",
        data: null,
        extensions: [],
      };
    }

    const myStatus = LikeStatus.None;

    const resultComment = {
      ...newComment,
      likesInfo: {
        ...newComment.likesInfo,
        myStatus: myStatus,
      },
    };

    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: resultComment,
    };
  }

  async getCommentByPostId(
    postId: string,
    query: CommentsQuery,
    userId: string | null,
  ) {
    // Получаем комментарии с пагинацией
    const commentsPage = await this.commentsRepository.getCommentsByPostId(
      postId,
      query,
    );

    if (!commentsPage) {
      return {
        status: resultStatus.ERROR,
        errorMessages: "Comments not found",
        data: null,
        extensions: [],
      };
    }

    // Добавляем myStatus для текущего пользователя
    const itemsWithStatus = await Promise.all(
      commentsPage.items.map(async (comment) => {
        let myStatus: LikeStatus = LikeStatus.None;

        if (userId) {
          const statusCurrentUser =
            await this.commentsRepository.getStatusByUserId(comment.id, userId);
          if (statusCurrentUser && statusCurrentUser.status) {
            myStatus =
              LikeStatus[statusCurrentUser.status as keyof typeof LikeStatus];
          }
        }

        return {
          ...comment,
          likesInfo: {
            ...comment.likesInfo,
            myStatus,
          },
        };
      }),
    );

    // Возвращаем объект с пагинацией и items с myStatus
    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: {
        pagesCount: commentsPage.pagesCount,
        page: commentsPage.page,
        pageSize: commentsPage.pageSize,
        totalCount: commentsPage.totalCount,
        items: itemsWithStatus,
      },
    };
  }

  async getByCommentId(commentId: string, userId: string | null) {
    const comment = await this.commentsRepository.getCommentById(commentId);
    if (!comment) {
      return {
        status: resultStatus.NOT_FOUND,
        errorMessages: "Failed to get a comment",
        data: null,
        extensions: [],
      };
    }

    if (userId === null) {
      const commentForUnauthorized = {
        id: comment.id,
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        likesInfo: { ...comment.likesInfo, myStatus: "None" },
        createdAt: comment.createdAt,
      };

      return {
        status: resultStatus.SUCCESS,
        extensions: [],
        data: commentForUnauthorized,
      };
    }

    const statusCurrentUser = userId
      ? await this.commentsRepository.getStatusByUserId(commentId, userId)
      : null;
    let myStatus: LikeStatus = LikeStatus.None;
    if (statusCurrentUser && statusCurrentUser.status) {
      myStatus =
        LikeStatus[statusCurrentUser.status as keyof typeof LikeStatus];
    }

    const commentWithStatus = {
      ...comment,
      likesInfo: {
        ...comment.likesInfo,
        myStatus,
      },
    };

    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: commentWithStatus,
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

  async setLikeStatus(
    commentId: string,
    newLikeStatusString: string,
    userId: string,
  ): Promise<ResultObject<{} | null>> {
    if (!(newLikeStatusString in LikeStatus)) {
      return {
        status: resultStatus.ERROR,
        errorMessages: "Is invalid",
        data: null,
        extensions: [],
      };
    }

    const comment = await this.commentsRepository.getCommentById(commentId);
    if (!comment) {
      return {
        status: resultStatus.NOT_FOUND,
        errorMessages: "id not found",
        data: null,
        extensions: [],
      };
    }

    const newlikeStatus: LikeStatus =
      LikeStatus[newLikeStatusString as keyof typeof LikeStatus];
    const currentLikeStatusUser =
      await this.commentsRepository.getStatusByUserId(commentId, userId);

    const currentStatus = currentLikeStatusUser
      ? currentLikeStatusUser.status
      : LikeStatus.None;
    const { likesCount, dislikesCount, finalStatus } = this.updateReaction(
      currentStatus,
      newlikeStatus,
      comment.likesInfo.likesCount,
      comment.likesInfo.dislikesCount,
    );
    await this.commentsRepository.updateStatusByUserId(
      commentId,
      userId,
      finalStatus,
    );
    await this.commentsRepository.setCommentLikeStatus(
      comment.id,
      likesCount,
      dislikesCount,
    );

    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: {},
    };
  }

  updateReaction(
    currentStatus: LikeStatus,
    newStatus: LikeStatus,
    likesCount: number,
    dislikesCount: number,
  ) {
    if (currentStatus === newStatus) {
      return { likesCount, dislikesCount, finalStatus: currentStatus };
    }

    if (currentStatus === LikeStatus.Like && likesCount > 0) {
      likesCount--;
    }

    if (currentStatus === LikeStatus.Dislike && dislikesCount > 0) {
      dislikesCount--;
    }

    if (newStatus === LikeStatus.Like) {
      likesCount++;
    }
    if (newStatus === LikeStatus.Dislike) {
      dislikesCount++;
    }

    return { likesCount, dislikesCount, finalStatus: newStatus };
  }
}

export default CommentsService;
