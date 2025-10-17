import {Router} from "express";
import {basicAuth} from "../../core/milldlewares/super-admin.guard-middleware";
import {nameValidation} from "../../core/milldlewares/validation/nameValidation";
import {websiteValidation} from "../../core/milldlewares/validation/websiteValidation";
import {inputValidationMiddleware} from "../../core/milldlewares/validation/input-validation-middleware";
import BlogHandler from "./handlers/BlogHandler";
import {
    paginationAndSortingValidation,
    paginationAndSortingValidationWithSearchName
} from "../../core/milldlewares/validation/query-pagination-sorting.validation-middleware";
import {titleValidation} from "../../core/milldlewares/validation/titleValidation";
import {contentValidation} from "../../core/milldlewares/validation/contentValidation";
import {shortDescriptionValidation} from "../../core/milldlewares/validation/shortDescriptionValidation";
import {getBlogsHandler} from "./handlers/get-blogs.handler";
import {queryIdMiddleware} from "../../core/milldlewares/validation/query-id.middleware";
import {getBlogByIdHandler} from "./handlers/get-blog-by-id.handler";
import {createBlogHandler} from "./handlers/create-blog.handler";
import {deleteBlogHandler} from "./handlers/delete-blog.handler";
import {updateBlogHandler} from "./handlers/update-blog.handler";
import {paramIdMiddleware} from "../../core/milldlewares/validation/param-id.middleware";

export const blogRouter = Router();

blogRouter.get("/",
    paginationAndSortingValidationWithSearchName(),
    getBlogsHandler
);

blogRouter.get("/:id",
    queryIdMiddleware,
    getBlogByIdHandler
);

blogRouter.post(
    "/",
    basicAuth,
    [nameValidation, websiteValidation],
    inputValidationMiddleware,
    createBlogHandler,
);

blogRouter.put(
    "/:id",
    basicAuth,
    [nameValidation, websiteValidation],
    inputValidationMiddleware,
    updateBlogHandler
);

blogRouter.delete(
    "/:id",
    queryIdMiddleware,
    basicAuth,
    deleteBlogHandler
);

/////////////////////
// REFACTORING LATER
/////////////////////
blogRouter.post(
    "/:blogId/posts",
    basicAuth,
    [titleValidation, contentValidation, shortDescriptionValidation],
    inputValidationMiddleware,
    BlogHandler.POST_BLOG_ID_POSTS,
)
blogRouter.get("/:blogId/posts",
    paramIdMiddleware,
    paginationAndSortingValidation(),
    BlogHandler.GET_BLOG_ID_POSTS);
