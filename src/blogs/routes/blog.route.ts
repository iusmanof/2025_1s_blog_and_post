import {Router } from "express";
import {basicAuth} from "../../auth/middlewares/super-admin.guard-middleware";
import {nameValidation} from "../../core/milldlewares/validation/nameValidation";
import {websiteValidation} from "../../core/milldlewares/validation/websiteValidation";
import {inputValidationMiddleware} from "../../core/milldlewares/validation/input-validation-middleware";
import BlogHandler from "./handlers/BlogHandler";
import {
    paginationAndSortingValidation,
    paginationAndSortingValidationWithSearchName
} from "../../core/milldlewares/validation/blogsQueryValidation";
import {titleValidation} from "../../core/milldlewares/validation/titleValidation";
import {contentValidation} from "../../core/milldlewares/validation/contentValidation";
import {shortDescriptionValidation} from "../../core/milldlewares/validation/shortDescriptionValidation";
import {getBlogsHandler} from "./handlers/get-blogs.handler";
import {queryIdMiddleware} from "../../core/milldlewares/validation/query-id.middleware";

export const blogRouter = Router();

blogRouter.get("/",
    paginationAndSortingValidationWithSearchName(),
    getBlogsHandler);

blogRouter.get("/:id",
    queryIdMiddleware,
    BlogHandler.GET_ID
);

blogRouter.get("/:blogId/posts",
    queryIdMiddleware,
    paginationAndSortingValidation(),
    BlogHandler.GET_BLOG_ID_POSTS);

blogRouter.post(
    "/",
    basicAuth,
    [nameValidation, websiteValidation],
    inputValidationMiddleware,
    BlogHandler.POST,
);

blogRouter.post(
    "/:blogId/posts",
    basicAuth,
    [titleValidation, contentValidation, shortDescriptionValidation],
    inputValidationMiddleware,
    BlogHandler.POST_BLOG_ID_POSTS,
)

blogRouter.put(
    "/:id",
    basicAuth,
    [nameValidation, websiteValidation],
    inputValidationMiddleware,
   BlogHandler.PUT
);

blogRouter.delete(
    "/:id",
    queryIdMiddleware,
    basicAuth,
    BlogHandler.DELETE
);
