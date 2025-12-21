import { Router } from "express";
import { accessTokenGuard } from "../../auth/access-token.guard";
import { commentValidationa } from "../middlewares/comments-validation.middleware";
import { inputValidationMiddleware } from "../../core/milldlewares/input-validation-middleware";
import { container } from "../../composition.root";
import { CommentController } from "../controllers/comment.controller";
import { likeStatusValidation } from "../middlewares/likeStatus-validation.middleware";

const commentController = container.get(CommentController);

export const commentsRouter = Router();

commentsRouter.get("/:id", commentController.getByCommentId);

commentsRouter.delete("/:id", accessTokenGuard, commentController.deleteById);

commentsRouter.put(
  "/:id",
  accessTokenGuard,
  [commentValidationa],
  inputValidationMiddleware,
  commentController.updateById,
);

commentsRouter.put(
  "/:id/like-status",
  accessTokenGuard,
  [likeStatusValidation],
  inputValidationMiddleware,
  commentController.setLikeStatus,
);
