import { inject, injectable } from "inversify";

import { PostsDto, PostModelWithId, PostQuery } from "../posts.dto";
import PostsRepository from "../infrastructure/posts.repository";

@injectable()
export class PostService {
  constructor(
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
  ) {}

  // async create(body: PostsDto) {
  //     const post = await this.postsRepository.createPost(body);
  //
  //     // Mapper
  //     const { _id, __v, ...rest } = post.toObject();
  //     return { ...rest, id: _id.toString() };
  // }
  async findMany(query: PostQuery) {
    return await this.postsRepository.getAllPosts(query);
  }
  async findById(id: string) {
    return await this.postsRepository.getPostById(id);
  }

  async update(id: string, body: PostModelWithId) {
    return await this.postsRepository.updatePost(id, body);
  }
  async delete(id: string) {
    return await this.postsRepository.deletePost(id);
  }
  async findPostsByBlogId(blogId: string, query: PostQuery): Promise<any> {
    return await this.postsRepository.getPostByBlogId(blogId, query);
  }
}
