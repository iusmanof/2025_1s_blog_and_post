"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const access_token_guard_1 = require("../../auth/presentation/access-token.guard");
const comments_validation_middleware_1 = require("./middlewares/comments-validation.middleware");
const composition_root_1 = require("../../composition.root");
const comment_controller_1 = require("./comment.controller");
const input_comments_validation_middleware_1 = require("./middlewares/input-comments-validation.middleware");
const like_status_validation_middleware_1 = require("./middlewares/like-status-validation.middleware");
const commentController = composition_root_1.container.get(comment_controller_1.CommentController);
exports.commentsRouter = (0, express_1.Router)();
exports.commentsRouter.get("/:id", commentController.getByCommentId);
exports.commentsRouter.delete("/:id", access_token_guard_1.accessTokenGuard, commentController.deleteById);
exports.commentsRouter.put("/:id", access_token_guard_1.accessTokenGuard, [comments_validation_middleware_1.commentValidation], input_comments_validation_middleware_1.inputCommentsValidationMiddleware, commentController.updateById);
exports.commentsRouter.put("/:id/like-status", access_token_guard_1.accessTokenGuard, [like_status_validation_middleware_1.likeStatusValidation], input_comments_validation_middleware_1.inputCommentsValidationMiddleware, commentController.setLikeStatus);
//# sourceMappingURL=comments.route.js.map