"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const super_admin_guard_middleware_1 = require("../../core/milldlewares/super-admin.guard-middleware");
const titleValidation_1 = require("../../core/milldlewares/validation/titleValidation");
const contentValidation_1 = require("../../core/milldlewares/validation/contentValidation");
const shortDescriptionValidation_1 = require("../../core/milldlewares/validation/shortDescriptionValidation");
const input_validation_middleware_1 = require("../../core/milldlewares/validation/input-validation-middleware");
const query_pagination_sorting_validation_middleware_1 = require("../../core/milldlewares/validation/query-pagination-sorting.validation-middleware");
const access_token_guard_1 = require("../../auth/access-token.guard");
const comments_validation_middleware_1 = require("../../core/milldlewares/validation/comments-validation.middleware");
const post_id_validation_middleware_1 = require("./middlewares/post-id-validation.middleware");
const user_id_validation_middleware_1 = require("./middlewares/user-id-validation.middleware");
const http_status_code_1 = __importDefault(require("../../core/types/http-status-code"));
const http_status_code_2 = __importDefault(require("../../core/types/http-status-code"));
const result_object_1 = require("../../core/types/result-object");
const http_status_code_3 = __importDefault(require("../../core/types/http-status-code"));
const composition_root_1 = require("../../composition.root");
exports.postRouter = (0, express_1.Router)();
exports.postRouter.get("/", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(), function getPostsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield composition_root_1.postService.findMany(req.query);
        res.status(http_status_code_2.default.OK_200).send(result);
    });
});
exports.postRouter.get("/:id", function getPostByIdHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postFounded = yield composition_root_1.postService.findById(req.params.id);
        if (!postFounded) {
            res.status(http_status_code_1.default.NOT_FOUND_404).send("No posts found.");
            return;
        }
        res.status(200).json(postFounded);
    });
});
exports.postRouter.post("/", super_admin_guard_middleware_1.basicAuth, [titleValidation_1.titleValidation, contentValidation_1.contentValidation, shortDescriptionValidation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, function createPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postCreated = yield composition_root_1.postService.create(req.body);
        const apiErrorMsg = [];
        if (!postCreated) {
            apiErrorMsg.push({ message: "ID Not found", field: "id" });
            res.status(http_status_code_1.default.NOT_FOUND_404).json({ errorsMessages: apiErrorMsg });
            return;
        }
        res.status(http_status_code_1.default.CREATED_201).json(postCreated);
    });
});
exports.postRouter.put("/:id", super_admin_guard_middleware_1.basicAuth, [titleValidation_1.titleValidation, contentValidation_1.contentValidation, shortDescriptionValidation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, function updatePostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postIsUpdated = yield composition_root_1.postService.update(req.params.id, req.body);
        const apiErrorMsg = [];
        if (!postIsUpdated) {
            apiErrorMsg.push({ message: "ID Not found", field: "id" });
            res.status(http_status_code_1.default.NOT_FOUND_404).json({ errorsMessages: apiErrorMsg });
            return;
        }
        res.status(http_status_code_1.default.NO_CONTENT_204).send();
    });
});
exports.postRouter.delete("/:id", super_admin_guard_middleware_1.basicAuth, function deletePostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield composition_root_1.postService.delete(req.params.id);
        if (!post) {
            res.status(http_status_code_1.default.NOT_FOUND_404).send("Not found");
            return;
        }
        res.status(http_status_code_1.default.NO_CONTENT_204).send();
    });
});
exports.postRouter.post("/:postId/comments", access_token_guard_1.accessTokenGuard, comments_validation_middleware_1.commentValidationa, input_validation_middleware_1.inputValidationMiddleware, post_id_validation_middleware_1.postIdValidationMiddleware, user_id_validation_middleware_1.userIdValidationMiddleware, function createCommentHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            res.status(http_status_code_2.default.UNAUTHORIZED_401).send("Unauthorized");
            return;
        }
        const userId = req.user.id;
        const postId = req.params.postId;
        const content = req.body.content;
        const post = yield composition_root_1.postService.findById(postId);
        if (!post) {
            res.status(http_status_code_2.default.NOT_FOUND_404).send("Post not found");
            return;
        }
        const result = yield composition_root_1.commentsService.create(userId, postId, content);
        if (result.status === result_object_1.resultStatus.ERROR) {
            res.status(http_status_code_2.default.BAD_REQUEST_400).json(result);
            return;
        }
        res.status(http_status_code_2.default.CREATED_201).json(result.data);
    });
});
exports.postRouter.get("/:postId/comments", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(), function getCommentsByPostIdHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = req.params.postId;
        const query = req.query;
        const post = yield composition_root_1.postService.findById(postId);
        if (!post) {
            res.status(http_status_code_2.default.NOT_FOUND_404).send("Post not found");
            return;
        }
        const result = yield composition_root_1.commentsService.getCommentByPostId(postId, query);
        if (!result) {
            res.status(http_status_code_2.default.NOT_FOUND_404).send("Not found");
        }
        res.status(http_status_code_3.default.OK_200).json(result.data);
    });
});
//# sourceMappingURL=post.route.js.map