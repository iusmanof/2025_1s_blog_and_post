import { Router } from "express";
import { accessTokenGuard } from "../../auth/presentation/access-token.guard";
import { commentValidation } from "./middlewares/comments-validation.middleware";
import { container } from "../../composition.root";
import { CommentController } from "./comment.controller";
import { inputCommentsValidationMiddleware } from "./middlewares/input-comments-validation.middleware";
import { likeStatusValidation } from "./middlewares/like-status-validation.middleware";

const commentController = container.get(CommentController);

export const commentsRouter = Router();

commentsRouter.get("/:id", commentController.getByCommentId);

commentsRouter.delete("/:id", accessTokenGuard, commentController.deleteById);

commentsRouter.put(
  "/:id",
  accessTokenGuard,
  [commentValidation],
  inputCommentsValidationMiddleware,
  commentController.updateById,
);

commentsRouter.put(
  "/:id/like-status",
  accessTokenGuard,
  [likeStatusValidation],
  inputCommentsValidationMiddleware,
  commentController.setLikeStatus,
);
