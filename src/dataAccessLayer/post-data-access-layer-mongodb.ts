import {PostModel, PostModelWithId, PostQuery} from "../model_types/PostModel";
import {getPostCollection} from "../repositories/db";
import {ObjectId} from "mongodb";
import {blogDataAccessLayerMongoDB} from "./blog-data-access-layer-mongodb";

export const postDataAccessLayerMongoDB = {
    getAllPosts: async (query: PostQuery) => {
        const {pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'asc'} = query;

        const skip = (pageNumber - 1) * pageSize;
        const sortDir = sortDirection === 'asc' ? 1 : -1;

        const result = await getPostCollection()
            .find({})
            .sort({[sortBy]: sortDir})
            .skip(+skip)
            .limit(+pageSize)
            .toArray();

        let resultWithId: {
            title: string;
            shortDescription: string;
            content: string;
            blogId: string;
            blogName: string;
            createdAt: string;
            id: string;
        }[];
        resultWithId = result.map(({_id, ...rest}) => ({
            ...rest,
            id: _id.toString(),
        }));
        return resultWithId;
    },
    getPostById: async (id: string) => {
        const result = await getPostCollection().findOne({_id: new ObjectId(id)});
        if (!result) {
            return null;
        }
        const postWithId = [{...result}].map(({_id, ...rest}) => ({
            ...rest,
            id: _id.toString(),
        }));
        return postWithId[0];
    },
    createPost: async (post: PostModel) => {
        const blog = await blogDataAccessLayerMongoDB.getBlogById(post.blogId);

        const postCreated = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blog ? blog.name : "Unknown",
            createdAt: new Date().toISOString(),
        };
        const result = await getPostCollection().insertOne({...postCreated});
        return {
            ...postCreated,
            id: result.insertedId.toString(),
        };
    },
    deletePost: async (id: string) => {
        const isDeleted = await getPostCollection().deleteOne({
            _id: new ObjectId(id),
        });
        return (await isDeleted.deletedCount) !== 0;
    },
    updatePost: async (id: string, post: PostModelWithId) => {
        const updateFields: Partial<PostModelWithId> = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
        };

        if (post.blogName) {
            updateFields.blogName = post.blogName;
        }
        const isUpdated = await getPostCollection().updateOne(
            {_id: new ObjectId(id)},
            {
                $set: updateFields,
            },
        );
        return (await isUpdated.matchedCount) !== 0;
    },
    deleteAllPosts: async () => {
        await getPostCollection().deleteMany({});
    },
    getPostByBlogId: async (blogId: string, query: PostQuery): Promise<any[]> => {
        const {pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'asc'} = query;

        const skip = (pageNumber - 1) * pageSize;
        const sortDir = sortDirection === 'asc' ? 1 : -1;

        const result = await getPostCollection()
            .find({blogId})
            .sort({[sortBy]: sortDir})
            .skip(+skip)
            .limit(+pageSize)
            .toArray();

        console.log(result);
        // objectID
        // const blogWithId: BlogWithId[] = result.map(({ _id, ...rest }) => ({
        //     ...rest,
        //     id: _id.toString(),
        // }));
        // return await blogWithId;


        return result
        // return await getPostCollection().findOne({_id: new ObjectId(blogId)});
    }
};
