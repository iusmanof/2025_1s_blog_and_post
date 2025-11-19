import { BlogBase, BlogQuery } from "../types/blog.dto";
import { PostsDto } from "../../posts/types/posts.dto";
import { BlogsRepository } from "../repositories/blogs.repository";

export class BlogService {
  constructor(public readonly blogsRepository: BlogsRepository) {}
  async findMany(query: BlogQuery) {
    return await this.blogsRepository.getAllBlogs(query);
  }
  async findById(id: string) {
    return await this.blogsRepository.getBlogById(id);
  }
  async create(body: BlogBase) {
    return await this.blogsRepository.createBlog(body);
  }
  async createPostByBlogId(body: PostsDto, blogId: string) {
    return await this.blogsRepository.createPostByBlogId(body, blogId);
  }
  async update(id: string, body: BlogBase) {
    return await this.blogsRepository.updateBlog(id, body);
  }
  async delete(id: string) {
    return await this.blogsRepository.deleteBlog(id);
  }
}
