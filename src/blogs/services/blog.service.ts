import {blogsRepository} from "../repositories/blogs.repository";
import {BlogBase, BlogQuery} from "../../core/types/BlogModel";
import {PostModel} from "../../core/types/PostModel";

const BlogService = {
    findMany: async (query: BlogQuery) => {
        // Business logic layer
        return await blogsRepository.getAllBlogs(query);
    },
    findById: async (id: string) => {
        // Business logic layer
        return await blogsRepository.getBlogById(id);
    },
    create: async (body: BlogBase) => {
        // Business logic layer
        return await blogsRepository.createBlog(body);
    },
    createPostByBlogId: async (body: PostModel, blogId: string) => {
        // Business logic layer
        return await blogsRepository.createPostByBlogId(body, blogId);
    },
    update: async (id: string, body: BlogBase) => {
        // Business logic layer
        return await blogsRepository.updateBlog(id, body);
    },
    delete: async (id: string) => {
        // Business logic layer
        return await blogsRepository.deleteBlog(id);
    },
}

export default BlogService;