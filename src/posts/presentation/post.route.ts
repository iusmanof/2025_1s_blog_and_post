import { container } from "../../composition.root";
import { Router } from "express";
import { titleValidationMiddleware } from "../../core/milldlewares/title-validation.middleware";
import { shortDescriptionValidationMiddleware } from "../../core/milldlewares/short-description-validation.middleware";
import { accessTokenGuard } from "../../auth/presentation/access-token.guard";
import { commentValidation } from "../../comments/presentation/middlewares/comments-validation.middleware";
import { postIdValidationMiddleware } from "./middlewares/post-id-validation.middleware";
import { userIdValidationMiddleware } from "./middlewares/user-id-validation.middleware";
import { PostController } from "./post.controller";
import { likeStatusValidationMiddleware } from "./middlewares/like-status-validation.middleware";
import { optionalAccessTokenGuard } from "./middlewares/optional-access-token.guard.middleware";
import { paginationAndSortingValidation } from "../../core/milldlewares/query-pagination-sorting-validation.middleware";
import { contentPostValidation } from "./middlewares/content-post-validation.middlewares";
import { inputPostValidationMiddleware } from "./middlewares/input-post-validation.middleware";
import { basicAuth } from "../../core/milldlewares/super-admin.guard.middleware";

const postController = container.get(PostController);

export const postRouter = Router();

postRouter.get(
  "/",
  optionalAccessTokenGuard,
  paginationAndSortingValidation,
  postController.findMany,
);

postRouter.get("/:id", optionalAccessTokenGuard, postController.findById);

postRouter.post(
  "/",
  basicAuth,
  [
    titleValidationMiddleware,
    contentPostValidation,
    shortDescriptionValidationMiddleware,
  ],
  inputPostValidationMiddleware,
  postController.create,
);

postRouter.put(
  "/:id",
  basicAuth,
  [
    titleValidationMiddleware,
    contentPostValidation,
    shortDescriptionValidationMiddleware,
  ],
  inputPostValidationMiddleware,
  postController.update,
);

postRouter.delete("/:id", basicAuth, postController.delete);

postRouter.post(
  "/:postId/comments",
  accessTokenGuard,
  commentValidation,
  inputPostValidationMiddleware,
  postIdValidationMiddleware,
  userIdValidationMiddleware,
  postController.createComment,
);

postRouter.get(
  "/:postId/comments",
  paginationAndSortingValidation(),
  postController.getComments,
);

postRouter.put(
  "/:postId/like-status",
  accessTokenGuard,
  likeStatusValidationMiddleware,
  inputPostValidationMiddleware,
  postController.getLikeStatus,
);
