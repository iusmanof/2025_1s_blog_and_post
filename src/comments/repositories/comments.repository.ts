import { inject, injectable } from "inversify";
import {
  commentsDataResultObject,
  commentsDBResultObject,
} from "../types/comments-data-result-object";
import { ObjectId } from "mongodb";
import { CommentsQuery } from "../types/comments-query";
import { UsersQueryRepository } from "../../users/repositories/users.query.repository";
import { UserMongooseModel } from "../../users/domain/user.entity";
import {
  CommentHydrateDocument,
  CommentMongooseModel,
} from "../domain/comments.entiry";

@injectable()
export class CommentsRepository {
  constructor(
    @inject(UsersQueryRepository)
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async create(
    userId: string,
    postId: string,
    content: string,
  ): Promise<CommentHydrateDocument | null> {
    const userData = await UserMongooseModel.findById(userId);
    if (!userData) {
      return null;
    }

    const comment = {
      postId: postId,
      content: content,
      commentatorInfo: {
        userId: userData.id,
        userLogin: userData.login,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
      createdAt: new Date().toISOString(),
    };

    return await CommentMongooseModel.create(comment);
  }

  async getCommentsByPostId(
    postId: string,
    query: CommentsQuery,
  ): Promise<commentsDBResultObject | null> {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = query;

    const skip = (pageNumber - 1) * pageSize;
    const sortDir = sortDirection === "asc" ? 1 : -1;
    const search = { postId: postId };

    const result = await CommentMongooseModel.find(search)
      .sort({ [sortBy]: sortDir })
      .skip(+skip)
      .limit(+pageSize)
      .exec();

    if (!result) {
      return null;
    }

    const totalCount = (await CommentMongooseModel.find(search).exec()).length;

    return {
      pagesCount: +Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: result.map((comment) => ({
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
      })),
    };
  }

  async getCommentById(
    commentId: string,
  ): Promise<commentsDataResultObject | null> {
    const result = await CommentMongooseModel.findOne({
      _id: new ObjectId(commentId),
    });

    if (!result) {
      return null;
    }

    return {
      id: result._id.toString(),
      content: result.content,
      commentatorInfo: result.commentatorInfo,
      createdAt: result.createdAt,
    };
  }

  async deleteById(commentId: string) {
    const result = await CommentMongooseModel.deleteOne({
      _id: new ObjectId(commentId),
    });
    if (result.deletedCount === 0) {
      return null;
    }
    return result;
  }

  async deleteAllComments() {
    await CommentMongooseModel.deleteMany({});
  }

  async updateById(commentId: string, content: string): Promise<{} | null> {
    const result = await CommentMongooseModel.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { content: content } },
    );
    if (result.matchedCount === 0) {
      return null;
    }
    return result;
  }
}
