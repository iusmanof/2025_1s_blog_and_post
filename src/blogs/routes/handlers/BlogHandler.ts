import HTTP_STATUS from "../../../core/types/HttpStatusCode";
import {Request, Response} from "express";
import {RequestWithParams, RequestWithParamsAndQuery, RequestWithQuery} from "../../../core/types/RequestTypes";
import {BlogQuery, BlogWithId} from "../../../core/types/BlogModel";
import {FieldError} from "../../../core/types/FieldError";
import BlogService from "../../application/blog.service";
import postService from "../../../posts/application/post.service";
import {PostModel} from "../../../core/types/PostModel";
import {validationResult} from "express-validator";

// @ts-ignore
const BlogHandler = {
    GET: async (req: RequestWithQuery<BlogQuery>, res: Response) => {
        const blogs = await BlogService.findMany(req.query);
        return res.status(HTTP_STATUS.OK_200).send(blogs);
    },
    GET_ID: async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return
        }

        const blog = await BlogService.findById(req.params.id);

        if (!blog) {
            res.status(HTTP_STATUS.NOT_FOUND_404).send("Blog not found.");
            return
        }
        res.status(200).json(blog);
    },
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
    POST: async (req: Request, res: Response) => {
        const blogCreated = await BlogService.create(req.body);
        return await res.status(HTTP_STATUS.CREATED_201).json(blogCreated);
    },

    POST_BLOG_ID_POSTS: async (req: Request<PostModel,{blogId: string}>, res: Response) => {
       const blog = await BlogService.findById(req.params.blogId);
        if(!blog){
            return await res.status(HTTP_STATUS.NOT_FOUND_404).send("Blog not found.");
        }
        const blogCreated  = await BlogService.createPostByBlogId(req.body, req.params.blogId);
        return await res.status(HTTP_STATUS.CREATED_201).json(blogCreated);
    },
    PUT: async (
        req: Request,
        res: Response<
            | BlogWithId
            | {
            errorsMessages: FieldError[];
        }
        >,
    ) => {
        const blogIsUpdated = await BlogService.update(req.params.id, req.body)
        const apiErrorMsg: FieldError[] = [];
        if (!blogIsUpdated) {
            apiErrorMsg.push({message: "ID Not found", field: "id"});
            return await res
                .status(HTTP_STATUS.NOT_FOUND_404)
                .json({errorsMessages: apiErrorMsg});
        }
        return await res.status(HTTP_STATUS.NO_CONTENT_204).send();
    },
    DELETE: async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(404).json({ errors: errors.array() });
            return
        }


        const blog = await BlogService.delete(req.params.id)
        if (!blog){
            res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found");
            return
        }

          res.status(HTTP_STATUS.NO_CONTENT_204).send();
    },
}

export default BlogHandler;