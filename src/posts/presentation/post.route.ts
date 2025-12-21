import { container } from "../../composition.root";
import { Router } from "express";
import { basicAuth } from "../../core/milldlewares/super-admin.guard-middleware";
import { titleValidation } from "../../core/milldlewares/title-validation";
import { contentValidation } from "../../core/milldlewares/contentValidation";
import { shortDescriptionValidation } from "../../core/milldlewares/short-description-validation";
import { inputValidationMiddleware } from "../../core/milldlewares/input-validation-middleware";
import { paginationAndSortingValidation } from "../../core/milldlewares/query-pagination-sorting.validation-middleware";
import { accessTokenGuard } from "../../auth/access-token.guard";
import { commentValidationa } from "../../comments/middlewares/comments-validation.middleware";
import { postIdValidationMiddleware } from "./middlewares/post-id-validation.middleware";
import { userIdValidationMiddleware } from "./middlewares/user-id-validation.middleware";
import { PostController } from "./post.controller";

const postController = container.get(PostController);

export const postRouter = Router();

postRouter.get("/", paginationAndSortingValidation(), postController.findMany);

postRouter.get("/:id", postController.findById);

postRouter.post(
  "/",
  basicAuth,
  [titleValidation, contentValidation, shortDescriptionValidation],
  inputValidationMiddleware,
  postController.create,
);

postRouter.put(
  "/:id",
  basicAuth,
  [titleValidation, contentValidation, shortDescriptionValidation],
  inputValidationMiddleware,
  postController.update,
);

postRouter.delete("/:id", basicAuth, postController.delete);

postRouter.post(
  "/:postId/comments",
  accessTokenGuard,
  commentValidationa,
  inputValidationMiddleware,
  postIdValidationMiddleware,
  userIdValidationMiddleware,
  postController.createComment,
);

postRouter.get(
  "/:postId/comments",
  paginationAndSortingValidation(),
  postController.getComments,
);
