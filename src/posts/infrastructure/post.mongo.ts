import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { Post } from "../types/post";
import { LikeStatus } from "../../comments/types/like";

export type newestLike = {
  userId: string;
  login: string;
  addedAt: Date;
};

type Reaction = {
  userId: string;
  login: string;
  status: LikeStatus;
  addedAt: Date;
};

export type PostDb = Post & {
  createdAt: Date;
  likesCount: number;
  dislikesCount: number;
  reactions: Reaction[];
};

type PostCreateParams = Omit<Post, "blogId"> & {
  blogId: string;
};

type PostMethods = {
  setLikeStatus(
    userId: string,
    login: string,
    likeStatus: LikeStatus,
  ): Promise<LikeStatus>;

  getExtendedLikesInfo(userId?: string): Promise<{
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: {
      addedAt: string;
      userId: string;
      login: string;
    }[];
  }>;
};

type PostStaticMethods = {
  createPost(params: PostCreateParams): PostDocument;
};

export type PostDocument = HydratedDocument<PostDb, PostMethods>;
type PostModelType = Model<PostDb, Record<string, never>, PostMethods> &
  PostStaticMethods;

const postSchema = new mongoose.Schema<PostDb, PostModelType, PostMethods>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
      required: true,
    },
    blogName: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    reactions: [
      {
        userId: { type: String, required: true },
        login: { type: String, required: true },
        status: {
          type: String,
          enum: Object.values(LikeStatus),
          required: true,
        },
        addedAt: { type: Date, required: true },
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    optimisticConcurrency: true,
  },
);

postSchema.methods.setLikeStatus = async function (
  userId: string,
  login: string,
  likeStatus: LikeStatus,
): Promise<LikeStatus> {
  const existingReaction = this.reactions.find((r) => r.userId === userId);

  if (existingReaction) {
    existingReaction.status = likeStatus;
    existingReaction.addedAt = new Date();
  } else {
    this.reactions.push({
      userId,
      login,
      status: likeStatus,
      addedAt: new Date(),
    });
  }

  this.likesCount = this.reactions.filter(
    (r) => r.status === LikeStatus.Like,
  ).length;

  this.dislikesCount = this.reactions.filter(
    (r) => r.status === LikeStatus.Dislike,
  ).length;

  await this.save();
  return likeStatus;
};

postSchema.methods.getExtendedLikesInfo = async function (userId?: string) {
  const myReaction = this.reactions.find((r) => r.userId === userId);

  const newestLikes = this.reactions
    .filter((r) => r.status === LikeStatus.Like)
    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
    .slice(0, 3)
    .map((r) => ({
      userId: r.userId,
      login: r.login,
      addedAt: r.addedAt.toISOString(),
    }));

  return {
    likesCount: this.likesCount,
    dislikesCount: this.dislikesCount,
    myStatus: myReaction?.status ?? LikeStatus.None,
    newestLikes,
  };
};

postSchema.statics.createPost = function (
  params: PostCreateParams,
): PostDocument {
  return new this({
    ...params,
    blogId: new mongoose.Types.ObjectId(params.blogId),
    likesCount: 0,
    dislikesCount: 0,
    reactions: [],
  });
};

export const PostModel = model<PostDb, PostModelType>("post", postSchema);
