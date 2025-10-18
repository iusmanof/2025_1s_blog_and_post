"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const super_admin_guard_middleware_1 = require("../../core/milldlewares/super-admin.guard-middleware");
const titleValidation_1 = require("../../core/milldlewares/validation/titleValidation");
const contentValidation_1 = require("../../core/milldlewares/validation/contentValidation");
const shortDescriptionValidation_1 = require("../../core/milldlewares/validation/shortDescriptionValidation");
const input_validation_middleware_1 = require("../../core/milldlewares/validation/input-validation-middleware");
const query_pagination_sorting_validation_middleware_1 = require("../../core/milldlewares/validation/query-pagination-sorting.validation-middleware");
const create_post_handler_1 = require("./handlers/create-post.handler");
const update_post_handler_1 = require("./handlers/update-post.handler");
const get_posts_handler_1 = require("./handlers/get-posts.handler");
const delete_post_handler_1 = require("./handlers/delete-post.handler");
const get_post_by_id_handler_1 = require("./handlers/get-post-by-id.handler");
const create_comment_handler_1 = require("./handlers/create-comment.handler");
const get_comment_handler_1 = require("./handlers/get-comment.handler");
exports.postRouter = (0, express_1.Router)();
exports.postRouter.get("/", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(), get_posts_handler_1.getPostsHandler);
exports.postRouter.get("/:id", get_post_by_id_handler_1.getPostByIdHandler);
exports.postRouter.post("/", super_admin_guard_middleware_1.basicAuth, [titleValidation_1.titleValidation, contentValidation_1.contentValidation, shortDescriptionValidation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, create_post_handler_1.createPostHandler);
exports.postRouter.put("/:id", super_admin_guard_middleware_1.basicAuth, [titleValidation_1.titleValidation, contentValidation_1.contentValidation, shortDescriptionValidation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, update_post_handler_1.updatePostHandler);
exports.postRouter.delete("/:id", super_admin_guard_middleware_1.basicAuth, delete_post_handler_1.deletePostHandler);
exports.postRouter.post("/:postId/comments", 
// basicAuth,
// guard ??
create_comment_handler_1.createCommentHandler);
exports.postRouter.get("/:postId/comments", 
// basicAuth,
// guard ??
get_comment_handler_1.getCommentHandler);
//# sourceMappingURL=post.route.js.map