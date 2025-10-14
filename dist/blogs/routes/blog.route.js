"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
const nameValidation_1 = require("../../core/milldlewares/validation/nameValidation");
const websiteValidation_1 = require("../../core/milldlewares/validation/websiteValidation");
const input_validation_middleware_1 = require("../../core/milldlewares/validation/input-validation-middleware");
const BlogHandler_1 = __importDefault(require("./handlers/BlogHandler"));
const query_pagination_sorting_validation_middleware_1 = require("../../core/milldlewares/validation/query-pagination-sorting.validation-middleware");
const titleValidation_1 = require("../../core/milldlewares/validation/titleValidation");
const contentValidation_1 = require("../../core/milldlewares/validation/contentValidation");
const shortDescriptionValidation_1 = require("../../core/milldlewares/validation/shortDescriptionValidation");
const get_blogs_handler_1 = require("./handlers/get-blogs.handler");
const query_id_middleware_1 = require("../../core/milldlewares/validation/query-id.middleware");
const get_blog_by_id_handler_1 = require("./handlers/get-blog-by-id.handler");
const create_blog_handler_1 = require("./handlers/create-blog.handler");
const delete_blog_handler_1 = require("./handlers/delete-blog.handler");
const update_blog_handler_1 = require("./handlers/update-blog.handler");
exports.blogRouter = (0, express_1.Router)();
exports.blogRouter.get("/", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidationWithSearchName)(), get_blogs_handler_1.getBlogsHandler);
exports.blogRouter.get("/:id", query_id_middleware_1.queryIdMiddleware, get_blog_by_id_handler_1.getBlogByIdHandler);
exports.blogRouter.post("/", super_admin_guard_middleware_1.basicAuth, [nameValidation_1.nameValidation, websiteValidation_1.websiteValidation], input_validation_middleware_1.inputValidationMiddleware, create_blog_handler_1.createBlogHandler);
exports.blogRouter.put("/:id", super_admin_guard_middleware_1.basicAuth, [nameValidation_1.nameValidation, websiteValidation_1.websiteValidation], input_validation_middleware_1.inputValidationMiddleware, update_blog_handler_1.updateBlogHandler);
exports.blogRouter.delete("/:id", query_id_middleware_1.queryIdMiddleware, super_admin_guard_middleware_1.basicAuth, delete_blog_handler_1.deleteBlogHandler);
/////////////////////
// REFACTORING LATER
/////////////////////
exports.blogRouter.post("/:blogId/posts", super_admin_guard_middleware_1.basicAuth, [titleValidation_1.titleValidation, contentValidation_1.contentValidation, shortDescriptionValidation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, BlogHandler_1.default.POST_BLOG_ID_POSTS);
exports.blogRouter.get("/:blogId/posts", query_id_middleware_1.queryIdMiddleware, (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(), BlogHandler_1.default.GET_BLOG_ID_POSTS);
//# sourceMappingURL=blog.route.js.map