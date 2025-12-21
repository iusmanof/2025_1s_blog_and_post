"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const access_token_guard_1 = require("../../auth/presentation/access-token.guard");
const comments_validation_middleware_1 = require("../middlewares/comments-validation.middleware");
const input_validation_middleware_1 = require("../../core/milldlewares/input-validation-middleware");
const composition_root_1 = require("../../composition.root");
const comment_controller_1 = require("../presentation/comment.controller");
const likeStatus_validation_middleware_1 = require("../middlewares/likeStatus-validation.middleware");
const commentController = composition_root_1.container.get(comment_controller_1.CommentController);
exports.commentsRouter = (0, express_1.Router)();
exports.commentsRouter.get("/:id", commentController.getByCommentId);
exports.commentsRouter.delete("/:id", access_token_guard_1.accessTokenGuard, commentController.deleteById);
exports.commentsRouter.put("/:id", access_token_guard_1.accessTokenGuard, [comments_validation_middleware_1.commentValidationa], input_validation_middleware_1.inputValidationMiddleware, commentController.updateById);
exports.commentsRouter.put("/:id/like-status", access_token_guard_1.accessTokenGuard, [likeStatus_validation_middleware_1.likeStatusValidation], input_validation_middleware_1.inputValidationMiddleware, commentController.setLikeStatus);
//# sourceMappingURL=comments.route.js.map