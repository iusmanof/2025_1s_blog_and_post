import { NextFunction, Request, Response } from "express";
import httpStatusCode from "../../../core/types/http-status-code";

export function postIdValidationMiddleware(
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction,
) {
  const postId = req.params.postId;
  if (!postId) {
    res.status(httpStatusCode.NOT_FOUND_404).send("postId not found");
    return;
  }
  next();
}
