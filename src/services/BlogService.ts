import {blogDataAccessLayerMongoDB} from "../dataAccessLayer/blog-data-access-layer-mongodb";

const BlogService = {
    findMany: async () => {
        return await blogDataAccessLayerMongoDB.getAllBlogs();
    },
    findById: async (id: string) => {
        return await blogDataAccessLayerMongoDB.getBlogById(id);
    },
    create: async () => {},
    update: async () => {},
    delete: async () => {},
}

export default BlogService;