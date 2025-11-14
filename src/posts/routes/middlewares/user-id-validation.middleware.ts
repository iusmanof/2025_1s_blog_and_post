import { NextFunction, Request, Response } from "express";

export function userIdValidationMiddleware(
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user || !req.user.id) {
    res.status(401).send("Unauthorized");
    return;
  }
  next();
}
