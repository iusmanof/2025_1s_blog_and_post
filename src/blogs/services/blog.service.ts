import { BlogBase, BlogQuery } from "../../core/types/BlogModel";
import { PostModel } from "../../core/types/PostModel";
import {BlogsRepository} from "../repositories/blogs.repository";

export class  BlogService  {
    constructor(public readonly blogsRepository: BlogsRepository) {
    }
  async findMany (query: BlogQuery) {
    return await this.blogsRepository.getAllBlogs(query);
  }
  async findById (id: string)  {
    return await this.blogsRepository.getBlogById(id);
  }
  async create (body: BlogBase) {
    return await this.blogsRepository.createBlog(body);
  }
  async createPostByBlogId(body: PostModel, blogId: string) {
    return await this.blogsRepository.createPostByBlogId(body, blogId);
  }
  async update  (id: string, body: BlogBase){
    return await this.blogsRepository.updateBlog(id, body);
  }async delete (id: string) {
    return await this.blogsRepository.deleteBlog(id);
  }
}

