import {RequestWithQuery} from "../../../core/types/RequestTypes";
import {PostQuery} from "../../../core/types/PostModel";
import {Response} from "express";
import PostService from "../../application/post.service";
import HTTP_STATUS from "../../../core/types/HttpStatusCode";

export async function getPostsHandler(req: RequestWithQuery<PostQuery>, res: Response) {
    const result = await PostService.findMany(req.query)
    return res.status(HTTP_STATUS.OK_200).send(result);
}