import {inject, injectable} from "inversify";
import {
    RequestWithParams,
    RequestWithParamsAndQuery,
    RequestWithQuery,
} from "../../core/types/request-types";
import {BlogQuery, BlogWithId} from "../blog";
import {Request, Response} from "express";
import HTTP_STATUS from "../../core/types/http-status-code";
import {BlogService} from "../application/blog.service";
import {validationResult} from "express-validator";
import {FieldError} from "../../core/types/field-error";
import {PostsDto} from "../../posts/posts.dto";
import httpStatusCode from "../../core/types/http-status-code";
import {PostService} from "../../posts/application/post.service";

@injectable()
export class BlogController {
    constructor(
        @inject(BlogService) private readonly blogService: BlogService,
        @inject(PostService) private readonly postService: PostService,
    ) {
    }

    create = async (req: Request, res: Response) => {
        const blogCreated = await this.blogService.create(req.body);
        return res.status(HTTP_STATUS.CREATED_201).json(blogCreated);
    };

    findMany = async (req: RequestWithQuery<BlogQuery>, res: Response) => {
        const blogs = await this.blogService.findMany(req.query);
        res.status(HTTP_STATUS.OK_200).send(blogs);
    };

    findById = async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()});
            return;
        }

        const blog = await this.blogService.findById(req.params.id);

        if (!blog) {
            res.status(HTTP_STATUS.NOT_FOUND_404).send("Blog not found.");
            return;
        }
        res.status(200).json(blog);
    };

    update = async (
        req: Request,
        res: Response<
            | BlogWithId
            | {
            errorsMessages: FieldError[];
        }
        >,
    ) => {
        const blogIsUpdated = await this.blogService.update(
            req.params.id,
            req.body,
        );
        const apiErrorMsg: FieldError[] = [];
        if (!blogIsUpdated) {
            apiErrorMsg.push({message: "ID Not found", field: "id"});
            return res
                .status(HTTP_STATUS.NOT_FOUND_404)
                .json({errorsMessages: apiErrorMsg});
        }

        return res.status(HTTP_STATUS.NO_CONTENT_204).send();
    };


    delete = async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(404).json({errors: errors.array()});
            return;
        }

        const blog = await this.blogService.delete(req.params.id);
        if (!blog) {
            res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found");
            return;
        }

        res.status(HTTP_STATUS.NO_CONTENT_204).send();
    };

    createPostByBlogId = async (
        req: Request<PostsDto, { blogId: string }>,
        res: Response,
    ) => {
        const blog = await this.blogService.findById(req.params.blogId);
        if (!blog) {
            res.status(httpStatusCode.NOT_FOUND_404).send("Blog not found.");
            return;
        }
        const blogCreated = await this.blogService.createPostByBlogId(
            req.body,
            req.params.blogId,
        );
        res.status(httpStatusCode.CREATED_201).json(blogCreated);
    };

    findPostsByBlogId = async (
        req: RequestWithParamsAndQuery<{ blogId: string }, BlogQuery>,
        res: Response,
    ) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(httpStatusCode.NOT_FOUND_404).json({errors: errors.array()});
            return;
        }

        const blogId = req.params.blogId;

        const blog = await this.blogService.findById(blogId);
        if (!blog) {
            res.status(httpStatusCode.NOT_FOUND_404).send("Blog not found.");
            return;
        }

        const posts = await this.postService.findPostsByBlogId(blogId, req.query);
        if (!posts) {
            res.status(httpStatusCode.NOT_FOUND_404).send("Posts not found.");
            return;
        }
        res.status(200).json(posts);
    };
}
