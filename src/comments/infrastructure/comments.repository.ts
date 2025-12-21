import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {CommentsQuery} from "../types/comments-query";
import {UsersQueryRepository} from "../../users/infrastructure/users.query.repository";
import {UserModel} from "../../users/infrastructure/user.mongo";
import {CommentMongooseModel, CommentReactionModel,} from "./comments.mongo";
import mongoose from "mongoose";

@injectable()
export class CommentsRepository {
  constructor(
    @inject(UsersQueryRepository)
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async create(userId: string, postId: string, content: string) {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    const newComment = await CommentMongooseModel.create({
      postId,
      content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
      createdAt: new Date().toISOString(),
    });

    const json = newComment.toJSON();

    return {
      id: json._id.toString(),
      content: json.content,
      commentatorInfo: json.commentatorInfo,
      likesInfo: json.likesInfo,
      createdAt: json.createdAt,
    };
  }

  async getCommentsByPostId(postId: string, query: CommentsQuery) {
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
      .lean()
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
        likesInfo: comment.likesInfo,
        createdAt: comment.createdAt,
      })),
    };
  }

  async getCommentById(commentId: string) {
    const result = await CommentMongooseModel.findOne({
      _id: new ObjectId(commentId),
    }).lean();

    if (!result) {
      return null;
    }

    return {
      id: result._id.toString(),
      content: result.content,
      commentatorInfo: result.commentatorInfo,
      likesInfo: result.likesInfo,
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

  async setCommentLikeStatus(
    id: string,
    likeCount: number,
    dislikeCount: number,
  ) {
      return CommentMongooseModel.updateOne(
          {_id: new mongoose.Types.ObjectId(id)},
          {
              $set: {
                  "likesInfo.likesCount": likeCount,
                  "likesInfo.dislikesCount": dislikeCount,
              },
          },
      );
  }

  async getStatusByUserId(commentId: string, userId: string) {
    return CommentReactionModel.findOne({ userId, commentId }).lean();
  }

  async updateStatusByUserId(
    commentId: string,
    userId: string,
    finalStatus: string,
  ) {
    await CommentReactionModel.updateOne(
      { userId, commentId },
      { status: finalStatus },
      { upsert: true },
    );
  }
}
