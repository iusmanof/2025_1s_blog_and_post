import {Request, Response} from "express";
import {PostModel} from "../../../core/types/PostModel";
import {FieldError} from "../../../core/types/FieldError";
import PostService from "../../application/post.service";
import HTTP_STATUS from "../../../core/types/HttpStatusCode";

export async function createPostHandler(req: Request<PostModel>, res: Response) {
    const postCreated = await PostService.create(req.body)
    const apiErrorMsg: FieldError[] = [];
    if (!postCreated) {
        apiErrorMsg.push({message: "ID Not found", field: "id"});
        await res
            .status(HTTP_STATUS.NOT_FOUND_404)
            .json({errorsMessages: apiErrorMsg});
    }
    await res.status(HTTP_STATUS.CREATED_201).json(postCreated);
}