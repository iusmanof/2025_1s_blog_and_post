import "reflect-metadata";
import { container } from "../../composition.root";
import { Router } from "express";
import { basicAuth } from "../../core/milldlewares/super-admin.guard-middleware";
import { nameValidation } from "../../core/milldlewares/nameValidation";
import { websiteValidation } from "../../core/milldlewares/website-validation";
import { inputValidationMiddleware } from "../../core/milldlewares/input-validation-middleware";
import {
  paginationAndSortingValidation,
  paginationAndSortingValidationWithSearchName,
} from "../../core/milldlewares/query-pagination-sorting.validation-middleware";
import { titleValidation } from "../../core/milldlewares/title-validation";
import { contentValidation } from "../../core/milldlewares/contentValidation";
import { shortDescriptionValidation } from "../../core/milldlewares/short-description-validation";
import { queryIdMiddleware } from "../../core/milldlewares/query-id.middleware";
import { paramIdMiddleware } from "../../core/milldlewares/param-id.middleware";
import { BlogController } from "./blog.controller";

export const blogRouter = Router();
const blogController = container.get(BlogController);

blogRouter.post(
    "/",
    basicAuth,
    [nameValidation, websiteValidation],
    inputValidationMiddleware,
    blogController.create,
);


blogRouter.get(
  "/",
  paginationAndSortingValidationWithSearchName(),
  blogController.findMany,
);

blogRouter.get("/:id", queryIdMiddleware, blogController.findById);

blogRouter.put(
  "/:id",
  basicAuth,
  [nameValidation, websiteValidation],
  inputValidationMiddleware,
  blogController.update,
);


blogRouter.delete("/:id", queryIdMiddleware, basicAuth, blogController.delete);

blogRouter.post(
  "/:blogId/posts",
  basicAuth,
  [titleValidation, contentValidation, shortDescriptionValidation],
  inputValidationMiddleware,
  blogController.createPostByBlogId,
);

// blogRouter.get(
//   "/:blogId/posts",
//   paramIdMiddleware,
//   paginationAndSortingValidation(),
//   blogController.findPostsByBlogId,
// );
