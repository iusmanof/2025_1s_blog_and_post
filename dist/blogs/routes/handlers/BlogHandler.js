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
const blog_service_1 = __importDefault(require("../../services/blog.service"));
const post_service_1 = __importDefault(require("../../../posts/services/post.service"));
const express_validator_1 = require("express-validator");
const HttpStatusCode_1 = __importDefault(require("../../../core/types/HttpStatusCode"));
// @ts-ignore
const BlogHandler = {
    GET_BLOG_ID_POSTS: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(HttpStatusCode_1.default.NOT_FOUND_404).json({ errors: errors.array() });
            return;
        }
        const blogId = req.params.blogId;
        const blog = yield blog_service_1.default.findById(blogId);
        if (!blog) {
            res.status(HttpStatusCode_1.default.NOT_FOUND_404).send("Blog not found.");
            return;
        }
        const posts = yield post_service_1.default.findPostsByBlogId(blogId, req.query);
        if (!posts) {
            res.status(HttpStatusCode_1.default.NOT_FOUND_404).send("Posts not found.");
            return;
        }
        res.status(200).json(posts);
    }),
    POST_BLOG_ID_POSTS: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield blog_service_1.default.findById(req.params.blogId);
        if (!blog) {
            res.status(HttpStatusCode_1.default.NOT_FOUND_404).send("Blog not found.");
            return;
        }
        const blogCreated = yield blog_service_1.default.createPostByBlogId(req.body, req.params.blogId);
        res.status(HttpStatusCode_1.default.CREATED_201).json(blogCreated);
    }),
};
exports.default = BlogHandler;
//# sourceMappingURL=BlogHandler.js.map