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
exports.blogRouter = void 0;
const express_1 = require("express");
const super_admin_guard_middleware_1 = require("../../core/milldlewares/super-admin.guard-middleware");
const nameValidation_1 = require("../../core/milldlewares/nameValidation");
const website_validation_1 = require("../../core/milldlewares/website-validation");
const input_validation_middleware_1 = require("../../core/milldlewares/input-validation-middleware");
const query_pagination_sorting_validation_middleware_1 = require("../../core/milldlewares/query-pagination-sorting.validation-middleware");
const title_validation_1 = require("../../core/milldlewares/title-validation");
const contentValidation_1 = require("../../core/milldlewares/contentValidation");
const short_description_validation_1 = require("../../core/milldlewares/short-description-validation");
const query_id_middleware_1 = require("../../core/milldlewares/query-id.middleware");
const param_id_middleware_1 = require("../../core/milldlewares/param-id.middleware");
const http_status_code_1 = __importDefault(require("../../core/types/http-status-code"));
const express_validator_1 = require("express-validator");
const http_status_code_2 = __importDefault(require("../../core/types/http-status-code"));
const composition_root_1 = require("../../composition.root");
exports.blogRouter = (0, express_1.Router)();
exports.blogRouter.get("/", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidationWithSearchName)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield composition_root_1.blogService.findMany(req.query);
    res.status(http_status_code_1.default.OK_200).send(blogs);
}));
exports.blogRouter.get("/:id", query_id_middleware_1.queryIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const blog = yield composition_root_1.blogService.findById(req.params.id);
    if (!blog) {
        res.status(http_status_code_1.default.NOT_FOUND_404).send("Blog not found.");
        return;
    }
    res.status(200).json(blog);
}));
exports.blogRouter.post("/", super_admin_guard_middleware_1.basicAuth, [nameValidation_1.nameValidation, website_validation_1.websiteValidation], input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogCreated = yield composition_root_1.blogService.create(req.body);
    return yield res.status(http_status_code_1.default.CREATED_201).json(blogCreated);
}));
exports.blogRouter.put("/:id", super_admin_guard_middleware_1.basicAuth, [nameValidation_1.nameValidation, website_validation_1.websiteValidation], input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogIsUpdated = yield composition_root_1.blogService.update(req.params.id, req.body);
    const apiErrorMsg = [];
    if (!blogIsUpdated) {
        apiErrorMsg.push({ message: "ID Not found", field: "id" });
        return yield res
            .status(http_status_code_1.default.NOT_FOUND_404)
            .json({ errorsMessages: apiErrorMsg });
    }
    return yield res.status(http_status_code_1.default.NO_CONTENT_204).send();
}));
exports.blogRouter.delete("/:id", query_id_middleware_1.queryIdMiddleware, super_admin_guard_middleware_1.basicAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(404).json({ errors: errors.array() });
        return;
    }
    const blog = yield composition_root_1.blogService.delete(req.params.id);
    if (!blog) {
        res.status(http_status_code_1.default.NOT_FOUND_404).send("Not found");
        return;
    }
    res.status(http_status_code_1.default.NO_CONTENT_204).send();
}));
exports.blogRouter.post("/:blogId/posts", super_admin_guard_middleware_1.basicAuth, [title_validation_1.titleValidation, contentValidation_1.contentValidation, short_description_validation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield composition_root_1.blogService.findById(req.params.blogId);
    if (!blog) {
        res.status(http_status_code_2.default.NOT_FOUND_404).send("Blog not found.");
        return;
    }
    const blogCreated = yield composition_root_1.blogService.createPostByBlogId(req.body, req.params.blogId);
    res.status(http_status_code_2.default.CREATED_201).json(blogCreated);
}));
exports.blogRouter.get("/:blogId/posts", param_id_middleware_1.paramIdMiddleware, (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(http_status_code_2.default.NOT_FOUND_404).json({ errors: errors.array() });
        return;
    }
    const blogId = req.params.blogId;
    const blog = yield composition_root_1.blogService.findById(blogId);
    if (!blog) {
        res.status(http_status_code_2.default.NOT_FOUND_404).send("Blog not found.");
        return;
    }
    const posts = yield composition_root_1.postService.findPostsByBlogId(blogId, req.query);
    if (!posts) {
        res.status(http_status_code_2.default.NOT_FOUND_404).send("Posts not found.");
        return;
    }
    res.status(200).json(posts);
}));
//# sourceMappingURL=blog.route.js.map