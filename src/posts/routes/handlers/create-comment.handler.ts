import { Request, Response } from "express";
import { commentsService } from "../../../comments/services/comments.service";
import { resultStatus } from "../../../core/types/result-object";
import httpStatusCode from "../../../core/types/http-status-code";
import postService from "../../services/post.service";

export async function createCommentHandler(
    req: Request<{ postId: string }, {}, { content: string }>,
    res: Response,
) {
    if (!req.user) {
        res.status(httpStatusCode.UNAUTHORIZED_401).send("Unauthorized");
        return;
    }

    const userId = req.user.id;
    const postId = req.params.postId;
    const content = req.body.content;

    const post = await postService.findById(postId);
    if (!post) {
        res.status(httpStatusCode.NOT_FOUND_404).send("Post not found");
        return;
    }

    const result = await commentsService.create(userId, postId, content);

    if (result.status === resultStatus.ERROR) {
        res.status(httpStatusCode.BAD_REQUEST_400).json(result);
        return;
    }

    res.status(httpStatusCode.CREATED_201).json(result.data);
}
