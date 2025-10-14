import {Router} from "express";
import {basicAuth} from "../../auth/middlewares/super-admin.guard-middleware";
import {titleValidation} from "../../core/milldlewares/validation/titleValidation";
import {contentValidation} from "../../core/milldlewares/validation/contentValidation";
import {shortDescriptionValidation} from "../../core/milldlewares/validation/shortDescriptionValidation";
import {inputValidationMiddleware} from "../../core/milldlewares/validation/input-validation-middleware";
import {paginationAndSortingValidation} from "../../core/milldlewares/validation/query-pagination-sorting.validation-middleware";
import {createPostHandler} from "./handlers/create-post.handler";
import {updatePostHandler} from "./handlers/update-post.handler";
import {getPostsHandler} from "./handlers/get-posts.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";
import {getPostByIdHandler} from "./handlers/get-post-by-id.handler";

export const postRouter = Router();

postRouter.get("/",
    paginationAndSortingValidation(),
    getPostsHandler
);

postRouter.get("/:id",
    getPostByIdHandler
);

postRouter.post("/",
    basicAuth,
    [titleValidation, contentValidation, shortDescriptionValidation],
    inputValidationMiddleware,
    createPostHandler
);

postRouter.put(
    "/:id",
    basicAuth,
    [titleValidation, contentValidation, shortDescriptionValidation],
    inputValidationMiddleware,
    updatePostHandler
);

postRouter.delete(
    "/:id",
    basicAuth,
    deletePostHandler
);
