import {Router } from "express";
import {basicAuth} from "../auth";
import {nameValidation} from "../bodyValidation/nameValidation";
import {websiteValidation} from "../bodyValidation/websiteValidation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import BlogHandler from "../handlers/BlogHandler";
import {
    paginationAndSortingValidation,
    paginationAndSortingValidationWithSearchName
} from "../queryValidation/blogsQueryValidation";
import {titleValidation} from "../bodyValidation/titleValidation";
import {contentValidation} from "../bodyValidation/contentValidation";
import {shortDescriptionValidation} from "../bodyValidation/shortDescriptionValidation";

export const BlogRouter = Router();

BlogRouter.get("/",
    paginationAndSortingValidationWithSearchName(),
    BlogHandler.GET);

BlogRouter.get("/:id", BlogHandler.GET_ID);

BlogRouter.get("/:blogId/posts",
    paginationAndSortingValidation(),
    BlogHandler.GET_BLOG_ID_POSTS);

BlogRouter.post(
    "/",
    basicAuth,
    [nameValidation, websiteValidation],
    inputValidationMiddleware,
    BlogHandler.POST,
);

BlogRouter.post(
    "/:blogId/posts",
    basicAuth,
    [titleValidation, contentValidation, shortDescriptionValidation],
    inputValidationMiddleware,
    BlogHandler.POST_BLOG_ID_POSTS,
)

BlogRouter.put(
    "/:id",
    basicAuth,
    [nameValidation, websiteValidation],
    inputValidationMiddleware,
   BlogHandler.PUT
);

BlogRouter.delete(
    "/:id",
    basicAuth,
    BlogHandler.DELETE
);
