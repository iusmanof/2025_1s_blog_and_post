import {PostModel, PostModelWithId} from "../model_types/PostModel";
import {postCollection} from "../repositories/db";
import {ObjectId} from "mongodb";
import {blogDataAccessLayerMongoDB} from "./blog-data-access-layer-mongodb";

export const postAccessLayerMongoDB = {
    getAllPosts: async () => {
        const result = await postCollection.find({}).toArray()
        let resultWithId: {
            title: string;
            shortDescription: string;
            content: string;
            blogId: string;
            blogName: string;
            createdAt: string;
            id: string
        }[];
        resultWithId = result.map(({_id, ...rest}) => ({
            ...rest,
            id: _id.toString(),
        }));
        return resultWithId;
    },
    getPostById: async (id: string) => {
        const result = await postCollection.findOne({_id: new ObjectId(id)})
        if (!result) {
            return null
        }
        const postWithId = [{...result}].map(({_id, ...rest}) => ({
            ...rest,
            id: _id.toString()
        }))
        return postWithId[0]
    },
    createPost: async (post: PostModel) => {
        const blog = await blogDataAccessLayerMongoDB.getBlogById(post.blogId);

        const postCreated = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blog ? blog.name : "Unknown",
            createdAt: new Date().toISOString()
        }
        const result = await postCollection.insertOne({...postCreated})
        return {
            ...postCreated,
            id: result.insertedId.toString(),
        }

    },
    deletePost: async (id: string) => {
        const isDeleted = await postCollection.deleteOne({_id: new ObjectId(id)})
        return await isDeleted.deletedCount !== 0;
    },
    updatePost: async (id: string, post: PostModelWithId) => {
        const updateFields: Partial<PostModelWithId> = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
        };

        if (post.blogName){
            updateFields.blogName = post.blogName;
        }
        const isUpdated = await postCollection.updateOne({_id: new ObjectId(id)}, {
            $set: updateFields
        })
        return await isUpdated.matchedCount !== 0;
    },
    deleteAllPosts: async () => {
        await postCollection.deleteMany({})
    },
}
