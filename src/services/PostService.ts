import {postDataAccessLayerMongoDB} from "../dataAccessLayer/post-data-access-layer-mongodb";
import {PostModel, PostModelWithId, PostQuery} from "../model_types/PostModel";

const PostService = {
    findMany: async (query: PostQuery) =>{
        // Business logic layer
        return await postDataAccessLayerMongoDB.getAllPosts(query);
    },
    findById: async (id: string) =>{
        // Business logic layer
        return await postDataAccessLayerMongoDB.getPostById(id);
    },
    create: async (body: PostModel) =>{
        // Business logic layer
        return await postDataAccessLayerMongoDB.createPost(body);
    },
    update: async (id:string, body: PostModelWithId) =>{
        // Business logic layer
        return await postDataAccessLayerMongoDB.updatePost(id, body);
    },
    delete: async (id:string) =>{
        // Business logic layer
        return await postDataAccessLayerMongoDB.deletePost(id);
    },
    findPostsByBlogId: async (blogId: string, query: PostQuery): Promise<any> =>  {
        // Business logic layer
        return await postDataAccessLayerMongoDB.getPostByBlogId(blogId, query);
    }
}

export default PostService;