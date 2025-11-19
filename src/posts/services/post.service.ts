import {
  PostModel,
  PostModelWithId,
  PostQuery,
} from "../../core/types/PostModel";
import {PostsRepository} from "../repositories/posts.repository";

export class PostService {
    constructor(public readonly postsRepository: PostsRepository) {}
  async findMany(query: PostQuery) {
    return await this.postsRepository.getAllPosts(query);
  }
  async findById (id: string) {
    return await this.postsRepository.getPostById(id);
  }
  async create(body: PostModel)  {
    return await this.postsRepository.createPost(body);
  }
  async update (id: string, body: PostModelWithId)  {
    return await this.postsRepository.updatePost(id, body);
  }
  async delete (id: string)  {
    return await this.postsRepository.deletePost(id);
  }
  async findPostsByBlogId (blogId: string, query: PostQuery): Promise<any>  {
    return await this.postsRepository.getPostByBlogId(blogId, query);
  }
}

