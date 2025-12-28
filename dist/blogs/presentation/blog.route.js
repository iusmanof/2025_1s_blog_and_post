"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
require("reflect-metadata");
const composition_root_1 = require("../../composition.root");
const express_1 = require("express");
const name_validation_middleware_1 = require("./middlewares/name-validation.middleware");
const website_validation_1 = require("./middlewares/website-validation");
const title_validation_middleware_1 = require("../../core/milldlewares/title-validation.middleware");
const content_blog_validation_middlewares_1 = require("./middlewares/content-blog-validation.middlewares");
const short_description_validation_middleware_1 = require("../../core/milldlewares/short-description-validation.middleware");
const query_id_middleware_1 = require("./middlewares/query-id.middleware");
const param_id_middleware_1 = require("./middlewares/param-id.middleware");
const blog_controller_1 = require("./blog.controller");
const super_admin_guard_middleware_1 = require("../../core/milldlewares/super-admin.guard.middleware");
const input_blogs_validation_middleware_1 = require("./middlewares/input-blogs-validation.middleware");
const query_pagination_sorting_validation_middleware_1 = require("../../core/milldlewares/query-pagination-sorting-validation.middleware");
const optional_access_token_guard_middleware_1 = require("../../posts/presentation/middlewares/optional-access-token.guard.middleware");
exports.blogRouter = (0, express_1.Router)();
const blogController = composition_root_1.container.get(blog_controller_1.BlogController);
exports.blogRouter.post("/", super_admin_guard_middleware_1.basicAuth, [name_validation_middleware_1.nameValidationMiddleware, website_validation_1.websiteValidation], input_blogs_validation_middleware_1.inputBlogsValidationMiddleware, blogController.create);
exports.blogRouter.get("/", query_pagination_sorting_validation_middleware_1.paginationAndSortingValidationWithSearchName, blogController.findMany);
exports.blogRouter.get("/:id", query_id_middleware_1.queryIdMiddleware, blogController.findById);
exports.blogRouter.put("/:id", super_admin_guard_middleware_1.basicAuth, [name_validation_middleware_1.nameValidationMiddleware, website_validation_1.websiteValidation], input_blogs_validation_middleware_1.inputBlogsValidationMiddleware, blogController.update);
exports.blogRouter.delete("/:id", query_id_middleware_1.queryIdMiddleware, super_admin_guard_middleware_1.basicAuth, blogController.delete);
exports.blogRouter.post("/:blogId/posts", super_admin_guard_middleware_1.basicAuth, [
    title_validation_middleware_1.titleValidationMiddleware,
    content_blog_validation_middlewares_1.contentBlogValidationMiddlewares,
    short_description_validation_middleware_1.shortDescriptionValidationMiddleware,
], input_blogs_validation_middleware_1.inputBlogsValidationMiddleware, blogController.createPostByBlogId);
exports.blogRouter.get("/:blogId/posts", optional_access_token_guard_middleware_1.optionalAccessTokenGuard, param_id_middleware_1.paramIdMiddleware, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation, blogController.findPostsByBlogId);
//# sourceMappingURL=blog.route.js.map