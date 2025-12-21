import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {Post} from "../post";

export type PostProps = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: mongoose.Types.ObjectId;
    blogName: string;
}

export type PostDocument = HydratedDocument<PostProps, PostMethods>;
type PostMethods = typeof postMethods;
type PostStaticMethods = typeof postStaticMethods;
type PostModelType = Model<PostProps, {}, PostMethods> & PostStaticMethods;

const postMethods = {
    test() {
    }
}

const postStaticMethods = {
    create_post_in_blog(params: { title: string; shortDescription: string; content: string; blogId: string; blogName?: string }): PostDocument {
        return new PostModel({
            title: params.title,
            shortDescription: params.shortDescription,
            content: params.content,
            blogId: new mongoose.Types.ObjectId(params.blogId), // конвертация здесь
            blogName: params.blogName || "Unknown",
        });
    },
}

const postSchema = new mongoose.Schema<Post>(
    {
        title: {type: String, required: true},
        shortDescription: {type: String, required: true},
        content: {type: String, required: true},
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "blog",
            required: true,
        },
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    },
);
postSchema.methods = postMethods;
postSchema.statics = postStaticMethods;

export const PostModel = model<Post, PostModelType>("post", postSchema);
