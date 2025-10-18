import {Request, Response, Router} from "express";

export const commentsRouter = Router();

commentsRouter.put("/:commentId", async (req: Request, res: Response) => {
        return res.status(200).json({json: "comments put"})
});

commentsRouter.delete("/:commentId", async (req: Request, res: Response) => {
    return res.status(200).json({json: "comments delete"})
});

commentsRouter.get("/:id", async (req: Request, res: Response) => {
    return res.status(200).json({json: "comments get"})
});