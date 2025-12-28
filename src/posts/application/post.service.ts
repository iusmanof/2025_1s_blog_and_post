import { inject, injectable } from "inversify";

import { PostsDto, PostModelWithId, PostQuery } from "../types/posts.dto";
import PostsRepository from "../infrastructure/posts.repository";
import { mapPostToView } from "./post.mapper";
import { LikeStatus } from "../../comments/types/like";
import { UsersRepository } from "../../users/infrastructure/users.repository";

@injectable()
export class PostService {
  constructor(
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async create(body: PostsDto) {
    const post = await this.postsRepository.createPost(body);
    return mapPostToView(post);
  }

  async findMany(query: PostQuery, userId?: string) {
    const posts = await this.postsRepository.getAllPosts(query);

    return {
      ...posts,
      items: await Promise.all(
        posts.items.map((p) => mapPostToView(p, userId)),
      ),
    };
  }

  async findById(id: string, userId?: string) {
    const post = await this.postsRepository.getPostById(id);
    if (!post) return null;

    return mapPostToView(post, userId);
  }

  async update(id: string, body: PostModelWithId) {
    return await this.postsRepository.updatePost(id, body);
  }

  async delete(id: string) {
    return await this.postsRepository.deletePost(id);
  }

  async findPostsByBlogId(blogId: string, query: PostQuery, userId?: string) {
    const { items, totalCount, pagesCount, page, pageSize } =
      await this.postsRepository.getPostByBlogId(blogId, query);

    const mappedItems = await Promise.all(
      items.map((post) => mapPostToView(post, userId)),
    );

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: mappedItems,
    };
  }

  async getLikeStatus(postId: string, userId: string, likeStatus: LikeStatus) {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) return null;

    const user = await this.usersRepository.findById(userId);
    if (!user) return null;

    const currentStatus = await post.setLikeStatus(
      userId,
      user.login,
      likeStatus,
    );

    return { likeStatus: currentStatus };
  }
}
