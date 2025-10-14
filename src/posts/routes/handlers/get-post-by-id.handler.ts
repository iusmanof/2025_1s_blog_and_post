import {RequestWithParams} from "../../../core/types/RequestTypes";
import {Response} from "express";
import PostService from "../../services/post.service";
import HTTP_STATUS from "../../../core/types/HttpStatusCode";

export async function getPostByIdHandler(req: RequestWithParams<{ id: string }>, res: Response)  {
    const postFounded = await PostService.findById(req.params.id)
    if (!postFounded)
        await res.status(HTTP_STATUS.NOT_FOUND_404).send("No posts found.");
    await res.status(200).json(postFounded)
}