import {blogDataAccessLayerMongoDB} from "../dataAccessLayer/blog-data-access-layer-mongodb";
import HTTP_STATUS from "../HTTP_STATUS_enum/HttpStatusCode";
import {Request, Response} from "express";
import {RequestWithParams} from "../model_types/RequestTypes";
import {BlogWithId} from "../model_types/BlogModel";
import {FieldError} from "../model_types/FieldError";

const BlogHandler = {
    GET:  async (req: Request, res: Response) => {
        const blogAll = await blogDataAccessLayerMongoDB.getAllBlogs();
        return await res.status(HTTP_STATUS.OK_200).send(blogAll);
    },
    GET_ID:  async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const blogFounded = await blogDataAccessLayerMongoDB.getBlogById(
            req.params.id,
        );
        if (!blogFounded)
            res.status(HTTP_STATUS.NOT_FOUND_404).send("Blog not found.");
        res.status(200).json(blogFounded);
    },
    POST:  async (req: Request, res: Response) => {
        const blogCreated = await blogDataAccessLayerMongoDB.createBlog(req.body);
        return await res.status(HTTP_STATUS.CREATED_201).json(blogCreated);
    },
    PUT:  async (
        req: Request,
        res: Response<
            | BlogWithId
            | {
            errorsMessages: FieldError[];
        }
        >,
    ) => {
        const blogIsUpdated = await blogDataAccessLayerMongoDB.updateBlog(
            req.params.id,
            req.body,
        );
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
        const blog = await blogDataAccessLayerMongoDB.deleteBlog(req.params.id);
        if (!blog)
            return await res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found");
        return await res.status(HTTP_STATUS.NO_CONTENT_204).send();
    },
}

export default BlogHandler;