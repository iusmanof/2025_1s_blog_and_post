import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import {
  RequestWithParams,
  RequestWithQuery,
} from "../../core/types/request-types";
import { PostsDto, PostModelWithId, PostQuery } from "../types/posts.dto";
import httpStatusCode from "../../core/types/http-status-code";
import { PostService } from "../services/post.service";
import HTTP_STATUS from "../../core/types/http-status-code";
import { FieldError } from "../../core/types/field-error";
import { resultStatus } from "../../core/types/result-object";
import CommentsService from "../../comments/services/comments.service";
import { CommentsQuery } from "../../comments/types/comments-query";
import HttpStatusCode from "../../core/types/http-status-code";
import { JwtAdapter } from "../../auth/adapters/jwt.adapter";

@injectable()
export class PostController {
  constructor(
    @inject(PostService) private readonly postService: PostService,
    @inject(CommentsService) private readonly commentsService: CommentsService,
    @inject(JwtAdapter) private readonly jwtAdapter: JwtAdapter,
  ) {}

  findMany = async (req: RequestWithQuery<PostQuery>, res: Response) => {
    const result = await this.postService.findMany(req.query);
    res.status(httpStatusCode.OK_200).send(result);
  };

  findById = async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const postFounded = await this.postService.findById(req.params.id);
    if (!postFounded) {
      res.status(HTTP_STATUS.NOT_FOUND_404).send("No posts found.");
      return;
    }
    res.status(200).json(postFounded);
  };

  create = async (req: Request<PostsDto>, res: Response) => {
    const postCreated = await this.postService.create(req.body);
    const apiErrorMsg: FieldError[] = [];
    if (!postCreated) {
      apiErrorMsg.push({ message: "ID Not found", field: "id" });
      res
        .status(HTTP_STATUS.NOT_FOUND_404)
        .json({ errorsMessages: apiErrorMsg });
      return;
    }
    res.status(HTTP_STATUS.CREATED_201).json(postCreated);
  };

  update = async (
    req: Request,
    res: Response<
      | PostModelWithId
      | {
          errorsMessages: FieldError[];
        }
    >,
  ) => {
    const postIsUpdated = await this.postService.update(
      req.params.id,
      req.body,
    );
    const apiErrorMsg: FieldError[] = [];
    if (!postIsUpdated) {
      apiErrorMsg.push({ message: "ID Not found", field: "id" });

      res
        .status(HTTP_STATUS.NOT_FOUND_404)
        .json({ errorsMessages: apiErrorMsg });
      return;
    }
    res.status(HTTP_STATUS.NO_CONTENT_204).send();
  };

  delete = async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const post = await this.postService.delete(req.params.id);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found");
      return;
    }
    res.status(HTTP_STATUS.NO_CONTENT_204).send();
  };

  createComment = async (
    req: Request<{ postId: string }, {}, { content: string }>,
    res: Response,
  ) => {
    if (!req.user) {
      res.status(httpStatusCode.UNAUTHORIZED_401).send("Unauthorized");
      return;
    }

    const userId = req.user.id;
    const postId = req.params.postId;
    const content = req.body.content;

    const post = await this.postService.findById(postId);
    if (!post) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Post not found");
      return;
    }

    const result = await this.commentsService.create(userId, postId, content);
    if (result.status === resultStatus.ERROR) {
      res.status(httpStatusCode.BAD_REQUEST_400).json(result);
      return;
    }

    res.status(httpStatusCode.CREATED_201).json(result.data);
  };

  getComments = async (
    req: Request<{ postId: string }, {}, {}, CommentsQuery>,
    res: Response,
  ) => {
    const postId = req.params.postId;
    const query = req.query;

    const post = await this.postService.findById(postId);
    if (!post) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Post not found");
      return;
    }

    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (token) {
      try {
        const payload: any = await this.jwtAdapter.verifyAccessToken(token);
        userId = payload.id;
      } catch {}
    }
    const result = await this.commentsService.getCommentByPostId(
      postId,
      query,
      userId,
    );
    if (!result) {
      res.status(httpStatusCode.NOT_FOUND_404).send("Not found");
      return;
    }
    res.status(HttpStatusCode.OK_200).json(result.data);
  };
}
