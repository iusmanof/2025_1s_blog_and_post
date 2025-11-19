import { Request, Response, Router } from "express";
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
import {
  RequestWithParams,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../../core/types/request-types";
import { BlogQuery, BlogWithId } from "../types/blog.dto";
import HTTP_STATUS from "../../core/types/http-status-code";
import { validationResult } from "express-validator";
import { FieldError } from "../../core/types/field-error";
import { PostsDto } from "../../posts/types/posts.dto";
import httpStatusCode from "../../core/types/http-status-code";
import { blogService, postService } from "../../composition.root";

export const blogRouter = Router();

blogRouter.get(
  "/",
  paginationAndSortingValidationWithSearchName(),
  async (req: RequestWithQuery<BlogQuery>, res: Response) => {
    const blogs = await blogService.findMany(req.query);
    res.status(HTTP_STATUS.OK_200).send(blogs);
  },
);

blogRouter.get(
  "/:id",
  queryIdMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const blog = await blogService.findById(req.params.id);

    if (!blog) {
      res.status(HTTP_STATUS.NOT_FOUND_404).send("Blog not found.");
      return;
    }
    res.status(200).json(blog);
  },
);

blogRouter.post(
  "/",
  basicAuth,
  [nameValidation, websiteValidation],
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const blogCreated = await blogService.create(req.body);
    return await res.status(HTTP_STATUS.CREATED_201).json(blogCreated);
  },
);

blogRouter.put(
  "/:id",
  basicAuth,
  [nameValidation, websiteValidation],
  inputValidationMiddleware,
  async (
    req: Request,
    res: Response<
      | BlogWithId
      | {
          errorsMessages: FieldError[];
        }
    >,
  ) => {
    const blogIsUpdated = await blogService.update(req.params.id, req.body);
    const apiErrorMsg: FieldError[] = [];
    if (!blogIsUpdated) {
      apiErrorMsg.push({ message: "ID Not found", field: "id" });
      return await res
        .status(HTTP_STATUS.NOT_FOUND_404)
        .json({ errorsMessages: apiErrorMsg });
    }
    return await res.status(HTTP_STATUS.NO_CONTENT_204).send();
  },
);

blogRouter.delete(
  "/:id",
  queryIdMiddleware,
  basicAuth,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(404).json({ errors: errors.array() });
      return;
    }

    const blog = await blogService.delete(req.params.id);
    if (!blog) {
      res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found");
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).send();
  },
);

blogRouter.post(
  "/:blogId/posts",
  basicAuth,
  [titleValidation, contentValidation, shortDescriptionValidation],
  inputValidationMiddleware,
  async (req: Request<PostsDto, { blogId: string }>, res: Response) => {
    const blog = await blogService.findById(req.params.blogId);
    if (!blog) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Blog not found.");
      return;
    }
    const blogCreated = await blogService.createPostByBlogId(
      req.body,
      req.params.blogId,
    );
    res.status(httpStatusCode.CREATED_201).json(blogCreated);
  },
);
blogRouter.get(
  "/:blogId/posts",
  paramIdMiddleware,
  paginationAndSortingValidation(),
  async (
    req: RequestWithParamsAndQuery<{ blogId: string }, BlogQuery>,
    res: Response,
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(httpStatusCode.NOT_FOUND_404).json({ errors: errors.array() });
      return;
    }

    const blogId = req.params.blogId;

    const blog = await blogService.findById(blogId);
    if (!blog) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Blog not found.");
      return;
    }

    const posts = await postService.findPostsByBlogId(blogId, req.query);
    if (!posts) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Posts not found.");
      return;
    }
    res.status(200).json(posts);
  },
);
