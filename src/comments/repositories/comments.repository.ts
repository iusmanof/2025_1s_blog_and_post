import { inject, injectable } from "inversify";
import { getCommentCollection } from "../../core/db/mongo.db";
import {
  commentsDataResultObject,
  commentsDBResultObject,
} from "../types/comments-data-result-object";
import { ObjectId } from "mongodb";
import { CommentsQuery } from "../types/comments-query";
import { UsersQueryRepository } from "../../users/repositories/users.query.repository";

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
  ): Promise<commentsDataResultObject | null> {
    const userData = await this.usersQueryRepository.findById(userId);
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
      createdAt: new Date().toISOString(),
    };

    const result = await getCommentCollection().insertOne(comment);

    return {
      commentatorInfo: comment.commentatorInfo,
      content: comment.content,
      createdAt: comment.createdAt,
      id: result.insertedId.toString(),
    };
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

    const result = await getCommentCollection()
      .find(search)
      .sort({ [sortBy]: sortDir })
      .skip(+skip)
      .limit(+pageSize)
      .toArray();

    if (!result) {
      return null;
    }

    const totalCount = (await getCommentCollection().find(search).toArray())
      .length;

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
    const result = await getCommentCollection().findOne({
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
    const result = await getCommentCollection().deleteOne({
      _id: new ObjectId(commentId),
    });
    if (result.deletedCount === 0) {
      return null;
    }
    return result;
  }
  async deleteAllComments() {
    await getCommentCollection().deleteMany({});
  }
  async updateById(commentId: string, content: string): Promise<{} | null> {
    const result = await getCommentCollection().updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { content: content } },
    );
    if (result.matchedCount === 0) {
      return null;
    }
    return result;
  }
}
