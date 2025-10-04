import HTTP_STATUS from "../HTTP_STATUS_enum/HttpStatusCode";
import {Request, Response} from "express";
import {RequestWithParams} from "../model_types/RequestTypes";
import {BlogWithId} from "../model_types/BlogModel";
import {FieldError} from "../model_types/FieldError";
import BlogService from "../services/BlogService";
import blogService from "../services/BlogService";

const BlogHandler = {
    GET:  async (req: Request, res: Response) => {
        const blogs = await BlogService.findMany();
        return await res.status(HTTP_STATUS.OK_200).send(blogs);
    },
    GET_ID:  async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const blog = await blogService.findById(req.params.id);
        if (!blog)
            res.status(HTTP_STATUS.NOT_FOUND_404).send("Blog not found.");
        res.status(200).json(blog);
    },
    POST:  async (req: Request, res: Response) => {
        const blogCreated = await blogService.create(req.body);
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
        const blogIsUpdated =await blogService.update(req.params.id, req.body)
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
        const blog = await blogService.delete(req.params.id)
        if (!blog)
            return await res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found");
        return await res.status(HTTP_STATUS.NO_CONTENT_204).send();
    },
}

export default BlogHandler;