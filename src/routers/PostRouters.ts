import {Router} from "express";
import {basicAuth} from "../auth";
import {titleValidation} from "../bodyValidation/titleValidation";
import {contentValidation} from "../bodyValidation/contentValidation";
import {shortDescriptionValidation} from "../bodyValidation/shortDescriptionValidation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import PostHandler from "../handlers/PostHandler";
import {paginationAndSortingValidation} from "../queryValidation/blogsQueryValidation";

export const PostRouter = Router();

PostRouter.get("/",
    paginationAndSortingValidation(),
    PostHandler.GET);

PostRouter.get("/:id", PostHandler.GET_ID);

PostRouter.post("/",
    basicAuth,
    [titleValidation, contentValidation, shortDescriptionValidation],
    inputValidationMiddleware,
    PostHandler.POST
);

PostRouter.put(
    "/:id",
    basicAuth,
    [titleValidation, contentValidation, shortDescriptionValidation],
    inputValidationMiddleware,
    PostHandler.PUT
);

PostRouter.delete(
    "/:id",
    basicAuth,
    PostHandler.DELETE
);
