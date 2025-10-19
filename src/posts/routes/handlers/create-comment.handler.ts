import {Request, Response} from "express";
import {commentsService} from "../../../comments/services/comments.service";
import {ResultStatus} from "../../../core/types/result-object";
import httpStatusCode from "../../../core/types/HttpStatusCode";
import postService from "../../services/post.service";

export async function createCommentHandler(req: Request<{ postId: string }, {}, { content: string }>, res: Response) {
    const userId = req.user?.id;
    const postId = req.params.postId;
    const content = req.body.content;

    if (!postId) {
        res.status(httpStatusCode.NOT_FOUND_404).send("postId not found");
        return
    }

    if (!userId) {
        res.status(httpStatusCode.UNAUTHORIZED_401).send("Unauthorized");
        return
    }

    const post = await postService.findById(postId);
    if (!post) {
        res.status(httpStatusCode.NOT_FOUND_404).send("Post not found");
        return
    }

    const result = await commentsService.create(userId, postId, content);

    if (result.status === ResultStatus.SUCCESS && result.data) {
        res.status(httpStatusCode.CREATED_201).json(result.data);
        return
    } else {
        res.status(httpStatusCode.BAD_REQUEST_400).json(result);
        return
    }
}
