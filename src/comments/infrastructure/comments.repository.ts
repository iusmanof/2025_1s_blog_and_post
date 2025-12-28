import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { UsersQueryRepository } from "../../users/infrastructure/users.query.repository";
import { UserModel } from "../../users/infrastructure/user.mongo";
import { CommentMongooseModel, CommentReactionModel } from "./comments.mongo";
import { CommentsQuery } from "../types/comments-query";
import { CommentEntity } from "../domain/comment.entity";

@injectable()
export class CommentsRepository {
  constructor(
    @inject(UsersQueryRepository)
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async create(commentEntity: CommentEntity) {
    const user = await UserModel.findById(commentEntity.getUserId());
    if (!user) return null;

    const comment = await CommentMongooseModel.createFromEntity({
      userId: commentEntity.getUserId(),
      postId: commentEntity.getPostId(),
      content: commentEntity.getContent(),
      userLogin: user.login,
    });

    return comment.toJSON();
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

    const items = await CommentMongooseModel.find({ postId })
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await CommentMongooseModel.countDocuments({ postId });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items: items.map((c) => ({
        id: c._id.toString(),
        content: c.content,
        commentatorInfo: c.commentatorInfo,
        likesInfo: c.likesInfo,
        createdAt: c.createdAt,
      })),
    };
  }

  async getCommentById(commentId: string) {
    const comment = await CommentMongooseModel.findById(commentId).lean();
    if (!comment) return null;
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      likesInfo: comment.likesInfo,
      createdAt: comment.createdAt,
    };
  }

  async deleteById(commentId: string) {
    const result = await CommentMongooseModel.deleteOne({
      _id: new ObjectId(commentId),
    });
    return result.deletedCount === 0 ? null : result;
  }

  async updateById(commentId: string, content: string) {
    const result = await CommentMongooseModel.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { content } },
    );
    return result.matchedCount === 0 ? null : result;
  }

  async setLikeStatus(
    commentId: string,
    newLikeStatus: string,
    userId: string,
  ) {
    const comment = await CommentMongooseModel.findById(commentId);
    if (!comment) return null;

    const currentStatus = await CommentReactionModel.findOne({
      commentId,
      userId,
    }).lean();
    const oldStatus = currentStatus?.status || "None";

    comment.updateReaction(oldStatus, newLikeStatus);
    await comment.save();

    await CommentReactionModel.updateOne(
      { commentId, userId },
      { status: newLikeStatus },
      { upsert: true },
    );

    return comment.toJSON();
  }

  async getStatusByUserId(commentId: string, userId: string) {
    return CommentReactionModel.findOne({ commentId, userId }).lean();
  }

  async deleteAllComments() {
    const result = await CommentMongooseModel.deleteMany({});
    return result.deletedCount === 0 ? null : result;
  }
}
