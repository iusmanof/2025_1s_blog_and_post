import {Request, Response} from "express";
import {commentsService} from "../../../comments/services/comments.service";
import HttpStatusCode from "../../../core/types/HttpStatusCode";
import {CommentsQuery} from "../../../comments/types/comments-query";
import httpStatusCode from "../../../core/types/HttpStatusCode";
import postService from "../../services/post.service";

export async function getCommentsByPostIdHandler(req: Request<{postId: string},{},{},  CommentsQuery  >, res: Response) {
    const postId = req.params.postId;
    const query = req.query;

    const post = await postService.findById(postId);
    if(!post){
        res.status(httpStatusCode.NOT_FOUND_404).send('Post not found');
        return;
    }

    const result = await commentsService.getCommentByPostId(postId, query)
    if (!result) {
        res.status(httpStatusCode.NOT_FOUND_404).send("Not found")
    }
    res.status(HttpStatusCode.OK_200).json(result.data);
}