import "reflect-metadata";
import { container } from "../../composition.root";
import { Router } from "express";
import { nameValidationMiddleware } from "./middlewares/name-validation.middleware";
import { websiteValidation } from "./middlewares/website-validation";
import { titleValidationMiddleware } from "../../core/milldlewares/title-validation.middleware";
import { contentBlogValidationMiddlewares } from "./middlewares/content-blog-validation.middlewares";
import { shortDescriptionValidationMiddleware } from "../../core/milldlewares/short-description-validation.middleware";
import { queryIdMiddleware } from "./middlewares/query-id.middleware";
import { paramIdMiddleware } from "./middlewares/param-id.middleware";
import { BlogController } from "./blog.controller";
import { basicAuth } from "../../core/milldlewares/super-admin.guard.middleware";
import { inputBlogsValidationMiddleware } from "./middlewares/input-blogs-validation.middleware";
import {
  paginationAndSortingValidation,
  paginationAndSortingValidationWithSearchName,
} from "../../core/milldlewares/query-pagination-sorting-validation.middleware";
import { optionalAccessTokenGuard } from "../../posts/presentation/middlewares/optional-access-token.guard.middleware";

export const blogRouter = Router();
const blogController = container.get(BlogController);

blogRouter.post(
  "/",
  basicAuth,
  [nameValidationMiddleware, websiteValidation],
  inputBlogsValidationMiddleware,
  blogController.create,
);

blogRouter.get(
  "/",
  paginationAndSortingValidationWithSearchName,
  blogController.findMany,
);

blogRouter.get("/:id", queryIdMiddleware, blogController.findById);

blogRouter.put(
  "/:id",
  basicAuth,
  [nameValidationMiddleware, websiteValidation],
  inputBlogsValidationMiddleware,
  blogController.update,
);

blogRouter.delete("/:id", queryIdMiddleware, basicAuth, blogController.delete);

blogRouter.post(
  "/:blogId/posts",
  basicAuth,
  [
    titleValidationMiddleware,
    contentBlogValidationMiddlewares,
    shortDescriptionValidationMiddleware,
  ],
  inputBlogsValidationMiddleware,
  blogController.createPostByBlogId,
);

blogRouter.get(
  "/:blogId/posts",
  optionalAccessTokenGuard,
  paramIdMiddleware,
  paginationAndSortingValidation,
  blogController.findPostsByBlogId,
);
