import {RequestWithParams} from "../../../core/types/RequestTypes";
import {Response} from "express";
import PostService from "../../services/post.service";
import HTTP_STATUS from "../../../core/types/HttpStatusCode";

export async function deletePostHandler (req: RequestWithParams<{ id: string }>, res: Response) {
    const post = await PostService.delete(req.params.id);
    if (!post) {
        res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found");
        return
    }
    res.status(HTTP_STATUS.NO_CONTENT_204).send();
}