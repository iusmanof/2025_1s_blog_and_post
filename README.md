# 2025_4w_pagin_sort_search


переписываю код на DDD
smart obkject  Mongoose является domain entity в моем проекте

Applicaton:
Service.js

@injectable()
export class PostService {
constructor(
@inject(PostsRepository) private readonly postsRepository: PostsRepository,
) {}

async create(body: PostsDto) {
return await this.postsRepository.createPost(body);
}


Infrastructure:
Repository.js
@injectable()
class PostsRepository {
constructor(
@inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
) {}


    async createPost(post: PostsDto) {
        const blog = await this.blogsRepository.getBlogById(post.blogId);

        const postDocument = new PostModel({
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blog ? blog.name : "Unknown",
        });

        await postDocument.save();

        const { _id, __v, ...rest } = postDocument.toObject();
        return {
            ...rest,
            id: _id.toString(),
        };
    }

Domain:
import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {Post, PostRequestInBlogBody} from "../post";

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
create_post_in_blog(postParams: PostRequestInBlogBody) {
const newPost = new PostModel() as PostDocument;
newPost.title = postParams.title;
newPost.shortDescription = postParams.shortDescription;
newPost.content = postParams.content;
newPost.blogId = postParams.blogId;
newPost.blogName = postParams.blogName;
return newPost;
}
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

POST /post
Request body

{
"title": "string",
"shortDescription": "string",
"content": "string",
"blogId": "string"
}
