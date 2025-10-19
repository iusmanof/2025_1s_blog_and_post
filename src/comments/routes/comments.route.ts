import {Request, Response, Router} from "express";
import httpStatusCode from "../../core/types/HttpStatusCode";
import {commentsRepository} from "../repositories/comments.repository";
import {commentsService} from "../services/comments.service";

export const commentsRouter = Router();

commentsRouter.put("/:commentId", async (req: Request, res: Response) => {
        return res.status(200).json({json: "comments put"})
});

commentsRouter.delete("/:commentId", async (req: Request, res: Response) => {
    return res.status(200).json({json: "comments delete"})
});

commentsRouter.get("/:id", async (req: Request<{id: string}>, res: Response) => {
    const commentId = req.params.id
    const result = await commentsService.getCommentById(commentId)

    if (!result) {
        res.status(httpStatusCode.NOT_FOUND_404).send("Not Found")
    }

    res.status(httpStatusCode.OK_200).json(result.data)
});