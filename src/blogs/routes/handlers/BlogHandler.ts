import HTTP_STATUS from "../../../core/types/HttpStatusCode";
import {Request, Response} from "express";
import {RequestWithParamsAndQuery} from "../../../core/types/RequestTypes";
import {BlogQuery} from "../../../core/types/BlogModel";
import BlogService from "../../services/blog.service";
import postService from "../../../posts/services/post.service";
import {PostModel} from "../../../core/types/PostModel";
import {validationResult} from "express-validator";

// @ts-ignore
const BlogHandler = {

    GET_BLOG_ID_POSTS: async (
        req: RequestWithParamsAndQuery<{ blogId: string }, BlogQuery>,
        res: Response
    ) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return
        }

        const blogId = req.params.blogId;

        const blog = await BlogService.findById(blogId);
        if (!blog)
            res.status(HTTP_STATUS.NOT_FOUND_404).send("Blog not found.");

        const posts = await postService.findPostsByBlogId(blogId, req.query);
        if (!posts) {
            res.status(HTTP_STATUS.NOT_FOUND_404).send("Posts not found.");
        }
        res.status(200).json(posts);
    },
    POST_BLOG_ID_POSTS: async (req: Request<PostModel,{blogId: string}>, res: Response) => {
       const blog = await BlogService.findById(req.params.blogId);
        if(!blog){
            return await res.status(HTTP_STATUS.NOT_FOUND_404).send("Blog not found.");
        }
        const blogCreated  = await BlogService.createPostByBlogId(req.body, req.params.blogId);
        return await res.status(HTTP_STATUS.CREATED_201).json(blogCreated);
    },
}

export default BlogHandler;