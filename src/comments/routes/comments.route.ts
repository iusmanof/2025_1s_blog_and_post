import {Request, Response, Router} from "express";
import httpStatusCode from "../../core/types/http-status-code";
import {commentsService} from "../services/comments.service";
import {accessTokenGuard} from "../../auth/access-token.guard";
import {resultStatus} from "../../core/types/result-object";
import {commentValidationa} from "../../core/milldlewares/validation/comments-validation.middleware";
import {inputValidationMiddleware} from "../../core/milldlewares/validation/input-validation-middleware";

export const commentsRouter = Router();


commentsRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const commentId = req.params.id
    const result = await commentsService.getCommentById(commentId)

    if (result.status === resultStatus.ERROR) {
        res.status(httpStatusCode.NOT_FOUND_404).send("Not Found");
        return
    }

    res.status(httpStatusCode.OK_200).send(result.data)
});

commentsRouter.delete("/:id",
    accessTokenGuard,
    async (req: Request<{ id: string }>, res: Response) => {
        const commentId = req.params.id
        const userId = (req as any).user.id; // refactor

        const comment = await commentsService.getCommentById(commentId)
        if (!comment.data) {  // refactor in service
            res.status(httpStatusCode.NOT_FOUND_404).send("Comment not found");
            return
        }

        if (comment.data?.commentatorInfo.userId !== userId) { // refactor in service
            res.status(httpStatusCode.FORBIDDEN_403).send("If try delete the comment that is not your own");
            return
        }

        const result = await commentsService.deleteById(commentId)


        if (result.status === resultStatus.ERROR) {
            res.status(httpStatusCode.NOT_FOUND_404).send("Comment not found")
            return
        }
        if (result.status === resultStatus.SUCCESS) {
            res.status(httpStatusCode.NO_CONTENT_204).send()
            return
        }

    });


commentsRouter.put("/:id",
    accessTokenGuard,
    [commentValidationa],
    inputValidationMiddleware,
    async (req: Request<{ id: string }, {}, { content: string }>, res: Response) => {
        const commentId = req.params.id;
        const content = req.body.content;
        const userId = (req as any).user.id;

        const comment = await commentsService.getCommentById(commentId)
        if (!comment.data) {
            res.status(httpStatusCode.NOT_FOUND_404).send("Comment not found");
            return
        }

        if (comment.data?.commentatorInfo.userId !== userId) {
            res.status(httpStatusCode.FORBIDDEN_403).send("If try delete the comment that is not your own");
            return
        }

        const result = await commentsService.updateById(commentId, content)
        if (result.status === resultStatus.ERROR) {
            res.status(httpStatusCode.NOT_FOUND_404).send("Comment not updated")
        }

        if (result.status === resultStatus.SUCCESS) {
            res.status(httpStatusCode.NO_CONTENT_204).send("Updated successfully")
        }

    });


