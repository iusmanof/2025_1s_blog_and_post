import {RequestWithParams} from "../../../core/types/RequestTypes";
import {Response} from "express";
import {validationResult} from "express-validator";
import BlogService from "../../services/blog.service";
import HTTP_STATUS from "../../../core/types/HttpStatusCode";

export async function getBlogByIdHandler(req: RequestWithParams<{ id: string }>, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return
    }

    const blog = await BlogService.findById(req.params.id);

    if (!blog) {
        res.status(HTTP_STATUS.NOT_FOUND_404).send("Blog not found.");
        return
    }
    res.status(200).json(blog);
}