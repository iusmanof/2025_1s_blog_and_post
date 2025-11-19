import { Request, Response, Router } from "express";
import { basicAuth } from "../../core/milldlewares/super-admin.guard-middleware";
import { titleValidation } from "../../core/milldlewares/title-validation";
import { contentValidation } from "../../core/milldlewares/contentValidation";
import { shortDescriptionValidation } from "../../core/milldlewares/short-description-validation";
import { inputValidationMiddleware } from "../../core/milldlewares/input-validation-middleware";
import { paginationAndSortingValidation } from "../../core/milldlewares/query-pagination-sorting.validation-middleware";
import { accessTokenGuard } from "../../auth/access-token.guard";
import { commentValidationa } from "../../core/milldlewares/comments-validation.middleware";
import { postIdValidationMiddleware } from "./middlewares/post-id-validation.middleware";
import { userIdValidationMiddleware } from "./middlewares/user-id-validation.middleware";
import { PostsDto, PostModelWithId, PostQuery } from "../types/posts.dto";
import { FieldError } from "../../core/types/field-error";
import HTTP_STATUS from "../../core/types/http-status-code";
import {
  RequestWithParams,
  RequestWithQuery,
} from "../../core/types/request-types";
import httpStatusCode from "../../core/types/http-status-code";
import { resultStatus } from "../../core/types/result-object";
import { CommentsQuery } from "../../comments/types/comments-query";
import HttpStatusCode from "../../core/types/http-status-code";
import { commentsService, postService } from "../../composition.root";

export const postRouter = Router();

postRouter.get(
  "/",
  paginationAndSortingValidation(),
  async function getPostsHandler(
    req: RequestWithQuery<PostQuery>,
    res: Response,
  ) {
    const result = await postService.findMany(req.query);
    res.status(httpStatusCode.OK_200).send(result);
  },
);

postRouter.get(
  "/:id",
  async function getPostByIdHandler(
    req: RequestWithParams<{ id: string }>,
    res: Response,
  ) {
    const postFounded = await postService.findById(req.params.id);
    if (!postFounded) {
      res.status(HTTP_STATUS.NOT_FOUND_404).send("No posts found.");
      return;
    }
    res.status(200).json(postFounded);
  },
);

postRouter.post(
  "/",
  basicAuth,
  [titleValidation, contentValidation, shortDescriptionValidation],
  inputValidationMiddleware,
  async function createPostHandler(req: Request<PostsDto>, res: Response) {
    const postCreated = await postService.create(req.body);
    const apiErrorMsg: FieldError[] = [];
    if (!postCreated) {
      apiErrorMsg.push({ message: "ID Not found", field: "id" });
      res
        .status(HTTP_STATUS.NOT_FOUND_404)
        .json({ errorsMessages: apiErrorMsg });
      return;
    }
    res.status(HTTP_STATUS.CREATED_201).json(postCreated);
  },
);

postRouter.put(
  "/:id",
  basicAuth,
  [titleValidation, contentValidation, shortDescriptionValidation],
  inputValidationMiddleware,
  async function updatePostHandler(
    req: Request,
    res: Response<
      | PostModelWithId
      | {
          errorsMessages: FieldError[];
        }
    >,
  ) {
    const postIsUpdated = await postService.update(req.params.id, req.body);
    const apiErrorMsg: FieldError[] = [];
    if (!postIsUpdated) {
      apiErrorMsg.push({ message: "ID Not found", field: "id" });

      res
        .status(HTTP_STATUS.NOT_FOUND_404)
        .json({ errorsMessages: apiErrorMsg });
      return;
    }
    res.status(HTTP_STATUS.NO_CONTENT_204).send();
  },
);

postRouter.delete(
  "/:id",
  basicAuth,
  async function deletePostHandler(
    req: RequestWithParams<{ id: string }>,
    res: Response,
  ) {
    const post = await postService.delete(req.params.id);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found");
      return;
    }
    res.status(HTTP_STATUS.NO_CONTENT_204).send();
  },
);

postRouter.post(
  "/:postId/comments",
  accessTokenGuard,
  commentValidationa,
  inputValidationMiddleware,
  postIdValidationMiddleware,
  userIdValidationMiddleware,
  async function createCommentHandler(
    req: Request<{ postId: string }, {}, { content: string }>,
    res: Response,
  ) {
    if (!req.user) {
      res.status(httpStatusCode.UNAUTHORIZED_401).send("Unauthorized");
      return;
    }

    const userId = req.user.id;
    const postId = req.params.postId;
    const content = req.body.content;

    const post = await postService.findById(postId);
    if (!post) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Post not found");
      return;
    }

    const result = await commentsService.create(userId, postId, content);

    if (result.status === resultStatus.ERROR) {
      res.status(httpStatusCode.BAD_REQUEST_400).json(result);
      return;
    }

    res.status(httpStatusCode.CREATED_201).json(result.data);
  },
);

postRouter.get(
  "/:postId/comments",
  paginationAndSortingValidation(),
  async function getCommentsByPostIdHandler(
    req: Request<{ postId: string }, {}, {}, CommentsQuery>,
    res: Response,
  ) {
    const postId = req.params.postId;
    const query = req.query;

    const post = await postService.findById(postId);
    if (!post) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Post not found");
      return;
    }

    const result = await commentsService.getCommentByPostId(postId, query);
    if (!result) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Not found");
    }
    res.status(HttpStatusCode.OK_200).json(result.data);
  },
);
