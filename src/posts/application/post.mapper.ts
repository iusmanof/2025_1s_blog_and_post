import { PostDocument } from "../infrastructure/post.mongo";

export async function mapPostToView(post: PostDocument, userId?: string) {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo: await post.getExtendedLikesInfo(userId),
  };
}
