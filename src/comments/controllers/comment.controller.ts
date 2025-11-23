import { inject, injectable } from "inversify";
import CommentsService from "../services/comments.service";
import { Request, Response } from "express";
import { resultStatus } from "../../core/types/result-object";
import httpStatusCode from "../../core/types/http-status-code";

@injectable()
export class CommentController {
  constructor(
    @inject(CommentsService) private readonly commentsService: CommentsService,
  ) {}

  getByCommentId = async (req: Request<{ id: string }>, res: Response) => {
    const commentId = req.params.id;
    const result = await this.commentsService.getByCommentId(commentId);

    if (result.status === resultStatus.NOT_FOUND) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Not Found");
      return;
    }
    res.status(httpStatusCode.OK_200).send(result.data);
  };

  deleteById = async (req: Request<{ id: string }>, res: Response) => {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await this.commentsService.getCommentById(
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
    req: Request<{ id: string }, {}, { content: string }>,
    res: Response,
  ) => {
    const commentId = req.params.id;
    const content = req.body.content;
    const userId = req.user.id;

    const comment = await this.commentsService.getCommentById(
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
    }

    if (result.status === resultStatus.SUCCESS) {
      res.status(httpStatusCode.NO_CONTENT_204).send("Updated successfully");
    }
  };
}
