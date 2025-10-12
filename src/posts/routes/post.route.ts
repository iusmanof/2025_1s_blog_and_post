import {Router} from "express";
import {basicAuth} from "../../auth/middlewares/super-admin.guard-middleware";
import {titleValidation} from "../../core/milldlewares/validation/titleValidation";
import {contentValidation} from "../../core/milldlewares/validation/contentValidation";
import {shortDescriptionValidation} from "../../core/milldlewares/validation/shortDescriptionValidation";
import {inputValidationMiddleware} from "../../core/milldlewares/validation/input-validation-middleware";
import PostHandler from "./handlers/PostHandler";
import {paginationAndSortingValidation} from "../../core/milldlewares/validation/blogsQueryValidation";

export const postRouter = Router();

postRouter.get("/",
    paginationAndSortingValidation(),
    PostHandler.GET);

postRouter.get("/:id", PostHandler.GET_ID);

postRouter.post("/",
    basicAuth,
    [titleValidation, contentValidation, shortDescriptionValidation],
    inputValidationMiddleware,
    PostHandler.POST
);

postRouter.put(
    "/:id",
    basicAuth,
    [titleValidation, contentValidation, shortDescriptionValidation],
    inputValidationMiddleware,
    PostHandler.PUT
);

postRouter.delete(
    "/:id",
    basicAuth,
    PostHandler.DELETE
);
