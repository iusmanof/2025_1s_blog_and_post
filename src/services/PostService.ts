import {postDataAccessLayerMongoDB} from "../dataAccessLayer/post-data-access-layer-mongodb";
import {PostModel, PostModelWithId} from "../model_types/PostModel";

const PostService = {
    findMany: async () =>{
        // Business logic layer
        return await postDataAccessLayerMongoDB.getAllPosts();
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
}

export default PostService;