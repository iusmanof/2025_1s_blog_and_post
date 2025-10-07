"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../auth");
const nameValidation_1 = require("../bodyValidation/nameValidation");
const websiteValidation_1 = require("../bodyValidation/websiteValidation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const BlogHandler_1 = __importDefault(require("../handlers/BlogHandler"));
const blogsQueryValidation_1 = require("../queryValidation/blogsQueryValidation");
const titleValidation_1 = require("../bodyValidation/titleValidation");
const contentValidation_1 = require("../bodyValidation/contentValidation");
const shortDescriptionValidation_1 = require("../bodyValidation/shortDescriptionValidation");
exports.BlogRouter = (0, express_1.Router)();
exports.BlogRouter.get("/", (0, blogsQueryValidation_1.paginationAndSortingValidationWithSearchName)(), BlogHandler_1.default.GET);
exports.BlogRouter.get("/:id", BlogHandler_1.default.GET_ID);
exports.BlogRouter.get("/:blogId/posts", (0, blogsQueryValidation_1.paginationAndSortingValidation)(), BlogHandler_1.default.GET_BLOG_ID_POSTS);
exports.BlogRouter.post("/", auth_1.basicAuth, [nameValidation_1.nameValidation, websiteValidation_1.websiteValidation], input_validation_middleware_1.inputValidationMiddleware, BlogHandler_1.default.POST);
exports.BlogRouter.post("/:blogId/posts", auth_1.basicAuth, [titleValidation_1.titleValidation, contentValidation_1.contentValidation, shortDescriptionValidation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, BlogHandler_1.default.POST_BLOG_ID_POSTS);
exports.BlogRouter.put("/:id", auth_1.basicAuth, [nameValidation_1.nameValidation, websiteValidation_1.websiteValidation], input_validation_middleware_1.inputValidationMiddleware, BlogHandler_1.default.PUT);
exports.BlogRouter.delete("/:id", auth_1.basicAuth, BlogHandler_1.default.DELETE);
//# sourceMappingURL=BlogRouters.js.map