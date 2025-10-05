import {blogDataAccessLayerMongoDB} from "../dataAccessLayer/blog-data-access-layer-mongodb";
import {BlogBase, BlogQuery} from "../model_types/BlogModel";

const BlogService = {
    findMany: async (query: BlogQuery) => {
        // Business logic layer
        return await blogDataAccessLayerMongoDB.getAllBlogs(query);
    },
    findById: async (id: string) => {
        // Business logic layer
        return await blogDataAccessLayerMongoDB.getBlogById(id);
    },
    create: async (body: BlogBase) => {
        // Business logic layer
        return await blogDataAccessLayerMongoDB.createBlog(body);
    },
    update: async (id: string, body: BlogBase) => {
        // Business logic layer
        return await blogDataAccessLayerMongoDB.updateBlog(id, body);
    },
    delete: async (id: string) => {
        // Business logic layer
        return await blogDataAccessLayerMongoDB.deleteBlog(id);
    },
}

export default BlogService;