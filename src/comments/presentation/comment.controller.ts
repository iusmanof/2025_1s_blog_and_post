import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { resultStatus } from "../../core/types/result-object";
import httpStatusCode from "../../core/types/http-status-code";
import { JwtAdapter } from "../../auth/application/adapters/jwt.adapter";
import { CommentsService } from "../application/comments.service";
import { AccessTokenPayload } from "../../posts/presentation/middlewares/optional-access-token.guard.middleware";

@injectable()
export class CommentController {
  constructor(
    @inject(CommentsService) private readonly commentsService: CommentsService,
    @inject(JwtAdapter) private readonly jwtAdapter: JwtAdapter,
  ) {}

  getByCommentId = async (req: Request<{ id: string }>, res: Response) => {
    const commentId = req.params.id;

    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (token) {
      try {
        const payload = (await this.jwtAdapter.verifyAccessToken(
          token,
        )) as AccessTokenPayload | null;

        if (payload?.id) {
          userId = payload.id;
        }
      } catch {}
    }

    const result = await this.commentsService.getByCommentId(commentId, userId);

    if (result.status === resultStatus.NOT_FOUND) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Not Found");
      return;
    }

    res.status(httpStatusCode.OK_200).send(result.data);
  };

  deleteById = async (req: Request<{ id: string }>, res: Response) => {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await this.commentsService.getByCommentId(
      commentId,
      userId,
    );
    if (comment.status == resultStatus.NOT_FOUND) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Comment not found");
      return;
    }

    if (comment.status == resultStatus.ERROR) {
      res
        .status(httpStatusCode.FORBIDDEN_403)
        .send("If try delete the comment that is not your own");
      return;
    }

    const result = await this.commentsService.deleteById(commentId);

    if (result.status === resultStatus.ERROR) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Comment not found");
      return;
    }
    if (result.status === resultStatus.SUCCESS) {
      res.status(httpStatusCode.NO_CONTENT_204).send();
      return;
    }
  };

  updateById = async (
    req: Request<{ id: string }, Record<string, never>, { content: string }>,
    res: Response,
  ) => {
    const commentId = req.params.id;
    const content = req.body.content;
    const userId = req.user.id;

    const comment = await this.commentsService.getByCommentId(
      commentId,
      userId,
    );
    if (comment.status == resultStatus.NOT_FOUND) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Comment not found");
      return;
    }

    if (comment.status == resultStatus.ERROR) {
      res
        .status(httpStatusCode.FORBIDDEN_403)
        .send("If try delete the comment that is not your own");
      return;
    }

    const result = await this.commentsService.updateById(commentId, content);
    if (result.status === resultStatus.ERROR) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Comment not updated");
      return;
    }

    if (result.status === resultStatus.SUCCESS) {
      res.status(httpStatusCode.NO_CONTENT_204).send("Updated successfully");
      return;
    }
  };

  setLikeStatus = async (
    req: Request<{ id: string }, Record<string, never>, { likeStatus: string }>,
    res: Response,
  ) => {
    const commentId = req.params.id;
    const likeStatus = req.body.likeStatus;
    const userId = req.user.id;
    const result = await this.commentsService.setLikeStatus(
      commentId,
      likeStatus,
      userId,
    );

    if (result.status === resultStatus.ERROR) {
      res.status(httpStatusCode.BAD_REQUEST_400).send("Comment is invalid");
      return;
    }

    if (result.status === resultStatus.NOT_FOUND) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Comment not founded");
      return;
    }

    if (result.status === resultStatus.SUCCESS) {
      res.status(httpStatusCode.NO_CONTENT_204).send("Update like status");
      return;
    }
  };
}
