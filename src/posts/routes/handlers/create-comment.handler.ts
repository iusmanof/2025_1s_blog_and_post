import {Request, Response} from "express";
import {commentsService} from "../../../comments/services/comments.service";
import {ResultStatus} from "../../../core/types/result-object";
import httpStatusCode from "../../../core/types/HttpStatusCode";
import {json} from "node:stream/consumers";

export async function createCommentHandler(req: Request<{postId: string},{},{ content: string}>, res: Response) {
    const userId = req.user?.id;
    const postId = req.params.postId;
    const content = req.body.content;

    if (!userId) {
        return null
    }

    const result = await commentsService.create(userId, postId, content)
    if (result.status === ResultStatus.SUCCESS && result.data){
            return res.status(httpStatusCode.CREATED_201).json(result.data)
    } else {
        return res.status(httpStatusCode.BAD_REQUEST_400).json(result)
    }

}
