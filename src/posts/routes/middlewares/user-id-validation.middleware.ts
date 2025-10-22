import {NextFunction, Request, Response} from "express";
import httpStatusCode from "../../../core/types/http-status-code";

export function userIdValidationMiddleware(req: Request<{ postId: string }>, res: Response, next: NextFunction) {
    const userId = req.user.id;
    if (!userId) { // refactor in validation
        res.status(httpStatusCode.UNAUTHORIZED_401).send("Unauthorized");
        return
    }
    next()
}