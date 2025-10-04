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
exports.BlogRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../auth");
const nameValidation_1 = require("../bodyValidation/nameValidation");
const websiteValidation_1 = require("../bodyValidation/websiteValidation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const blog_data_access_layer_mongodb_1 = require("../dataAccessLayer/blog-data-access-layer-mongodb");
const HttpStatusCode_1 = __importDefault(require("../HTTP_STATUS_enum/HttpStatusCode"));
const BlogHandler_1 = __importDefault(require("../handlers/blogs/BlogHandler"));
exports.BlogRouter = (0, express_1.Router)();
exports.BlogRouter.get("/", BlogHandler_1.default.GET);
exports.BlogRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogFounded = yield blog_data_access_layer_mongodb_1.blogDataAccessLayerMongoDB.getBlogById(req.params.id);
    if (!blogFounded)
        res.status(HttpStatusCode_1.default.NOT_FOUND_404).send("Blog not found.");
    res.status(200).json(blogFounded);
}));
exports.BlogRouter.post("/", auth_1.basicAuth, [nameValidation_1.nameValidation, websiteValidation_1.websiteValidation], input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogCreated = yield blog_data_access_layer_mongodb_1.blogDataAccessLayerMongoDB.createBlog(req.body);
    return yield res.status(HttpStatusCode_1.default.CREATED_201).json(blogCreated);
}));
exports.BlogRouter.put("/:id", auth_1.basicAuth, [nameValidation_1.nameValidation, websiteValidation_1.websiteValidation], input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogIsUpdated = yield blog_data_access_layer_mongodb_1.blogDataAccessLayerMongoDB.updateBlog(req.params.id, req.body);
    const apiErrorMsg = [];
    if (!blogIsUpdated) {
        apiErrorMsg.push({ message: "ID Not found", field: "id" });
        return yield res
            .status(HttpStatusCode_1.default.NOT_FOUND_404)
            .json({ errorsMessages: apiErrorMsg });
    }
    return yield res.status(HttpStatusCode_1.default.NO_CONTENT_204).send();
}));
exports.BlogRouter.delete("/:id", auth_1.basicAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_data_access_layer_mongodb_1.blogDataAccessLayerMongoDB.deleteBlog(req.params.id);
    if (!blog)
        return yield res.status(HttpStatusCode_1.default.NOT_FOUND_404).send("Not found");
    return yield res.status(HttpStatusCode_1.default.NO_CONTENT_204).send();
}));
