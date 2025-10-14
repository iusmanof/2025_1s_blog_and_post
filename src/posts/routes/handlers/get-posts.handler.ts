import {RequestWithQuery} from "../../../core/types/RequestTypes";
import {PostQuery} from "../../../core/types/PostModel";
import {Response} from "express";
import PostService from "../../services/post.service";
import httpStatusCode from "../../../core/types/HttpStatusCode";

export async function getPostsHandler(req: RequestWithQuery<PostQuery>, res: Response) {
    const result = await PostService.findMany(req.query)
    return res.status(httpStatusCode.OK_200).send(result);
}