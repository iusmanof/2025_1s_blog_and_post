"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const composition_root_1 = require("../../composition.root");
const express_1 = require("express");
const title_validation_middleware_1 = require("../../core/milldlewares/title-validation.middleware");
const short_description_validation_middleware_1 = require("../../core/milldlewares/short-description-validation.middleware");
const access_token_guard_1 = require("../../auth/presentation/access-token.guard");
const comments_validation_middleware_1 = require("../../comments/presentation/middlewares/comments-validation.middleware");
const post_id_validation_middleware_1 = require("./middlewares/post-id-validation.middleware");
const user_id_validation_middleware_1 = require("./middlewares/user-id-validation.middleware");
const post_controller_1 = require("./post.controller");
const like_status_validation_middleware_1 = require("./middlewares/like-status-validation.middleware");
const optional_access_token_guard_middleware_1 = require("./middlewares/optional-access-token.guard.middleware");
const query_pagination_sorting_validation_middleware_1 = require("../../core/milldlewares/query-pagination-sorting-validation.middleware");
const content_post_validation_middlewares_1 = require("./middlewares/content-post-validation.middlewares");
const input_post_validation_middleware_1 = require("./middlewares/input-post-validation.middleware");
const super_admin_guard_middleware_1 = require("../../core/milldlewares/super-admin.guard.middleware");
const postController = composition_root_1.container.get(post_controller_1.PostController);
exports.postRouter = (0, express_1.Router)();
exports.postRouter.get("/", optional_access_token_guard_middleware_1.optionalAccessTokenGuard, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation, postController.findMany);
exports.postRouter.get("/:id", optional_access_token_guard_middleware_1.optionalAccessTokenGuard, postController.findById);
exports.postRouter.post("/", super_admin_guard_middleware_1.basicAuth, [
    title_validation_middleware_1.titleValidationMiddleware,
    content_post_validation_middlewares_1.contentPostValidation,
    short_description_validation_middleware_1.shortDescriptionValidationMiddleware,
], input_post_validation_middleware_1.inputPostValidationMiddleware, postController.create);
exports.postRouter.put("/:id", super_admin_guard_middleware_1.basicAuth, [
    title_validation_middleware_1.titleValidationMiddleware,
    content_post_validation_middlewares_1.contentPostValidation,
    short_description_validation_middleware_1.shortDescriptionValidationMiddleware,
], input_post_validation_middleware_1.inputPostValidationMiddleware, postController.update);
exports.postRouter.delete("/:id", super_admin_guard_middleware_1.basicAuth, postController.delete);
exports.postRouter.post("/:postId/comments", access_token_guard_1.accessTokenGuard, comments_validation_middleware_1.commentValidation, input_post_validation_middleware_1.inputPostValidationMiddleware, post_id_validation_middleware_1.postIdValidationMiddleware, user_id_validation_middleware_1.userIdValidationMiddleware, postController.createComment);
exports.postRouter.get("/:postId/comments", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(), postController.getComments);
exports.postRouter.put("/:postId/like-status", access_token_guard_1.accessTokenGuard, like_status_validation_middleware_1.likeStatusValidationMiddleware, input_post_validation_middleware_1.inputPostValidationMiddleware, postController.getLikeStatus);
//# sourceMappingURL=post.route.js.map