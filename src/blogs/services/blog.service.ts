import { blogsRepository } from "../repositories/blogs.repository";
import { BlogBase, BlogQuery } from "../../core/types/BlogModel";
import { PostModel } from "../../core/types/PostModel";

const BlogService = {
  findMany: async (query: BlogQuery) => {
    return await blogsRepository.getAllBlogs(query);
  },
  findById: async (id: string) => {
    return await blogsRepository.getBlogById(id);
  },
  create: async (body: BlogBase) => {
    return await blogsRepository.createBlog(body);
  },
  createPostByBlogId: async (body: PostModel, blogId: string) => {
    return await blogsRepository.createPostByBlogId(body, blogId);
  },
  update: async (id: string, body: BlogBase) => {
    return await blogsRepository.updateBlog(id, body);
  },
  delete: async (id: string) => {
    return await blogsRepository.deleteBlog(id);
  },
};

export default BlogService;
