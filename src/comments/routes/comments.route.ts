import { Router } from "express";
import { accessTokenGuard } from "../../auth/access-token.guard";
import { commentValidationa } from "../../core/milldlewares/comments-validation.middleware";
import { inputValidationMiddleware } from "../../core/milldlewares/input-validation-middleware";
import { container } from "../../composition.root";
import { CommentController } from "../controllers/comment.controller";

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
