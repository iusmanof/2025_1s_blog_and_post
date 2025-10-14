import {Request, Response} from "express";
import {BlogWithId} from "../../../core/types/BlogModel";
import {FieldError} from "../../../core/types/FieldError";
import BlogService from "../../services/blog.service";
import HTTP_STATUS from "../../../core/types/HttpStatusCode";

export async function updateBlogHandler(
    req: Request,
    res: Response<
        | BlogWithId
        | {
        errorsMessages: FieldError[];
    }
    >,
) {
    const blogIsUpdated = await BlogService.update(req.params.id, req.body)
    const apiErrorMsg: FieldError[] = [];
    if (!blogIsUpdated) {
        apiErrorMsg.push({message: "ID Not found", field: "id"});
        return await res
            .status(HTTP_STATUS.NOT_FOUND_404)
            .json({errorsMessages: apiErrorMsg});
    }
    return await res.status(HTTP_STATUS.NO_CONTENT_204).send()
}