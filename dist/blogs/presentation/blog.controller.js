"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.BlogController = void 0;
const inversify_1 = require("inversify");
const http_status_code_1 = __importDefault(require("../../core/types/http-status-code"));
const blog_service_1 = require("../application/blog.service");
const express_validator_1 = require("express-validator");
const http_status_code_2 = __importDefault(require("../../core/types/http-status-code"));
const post_service_1 = require("../../posts/application/post.service");
let BlogController = class BlogController {
    constructor(blogService, postService) {
        this.blogService = blogService;
        this.postService = postService;
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blogCreated = yield this.blogService.create(req.body);
            return res.status(http_status_code_1.default.CREATED_201).json(blogCreated);
        });
        this.findMany = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blogs = yield this.blogService.findMany(req.query);
            res.status(http_status_code_1.default.OK_200).send(blogs);
        });
        this.findById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const blog = yield this.blogService.findById(req.params.id);
            if (!blog) {
                res.status(http_status_code_1.default.NOT_FOUND_404).send("Blog not found.");
                return;
            }
            res.status(200).json(blog);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blogIsUpdated = yield this.blogService.update(req.params.id, req.body);
            const apiErrorMsg = [];
            if (!blogIsUpdated) {
                apiErrorMsg.push({ message: "ID Not found", field: "id" });
                return res
                    .status(http_status_code_1.default.NOT_FOUND_404)
                    .json({ errorsMessages: apiErrorMsg });
            }
            return res.status(http_status_code_1.default.NO_CONTENT_204).send();
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(404).json({ errors: errors.array() });
                return;
            }
            const blog = yield this.blogService.delete(req.params.id);
            if (!blog) {
                res.status(http_status_code_1.default.NOT_FOUND_404).send("Not found");
                return;
            }
            res.status(http_status_code_1.default.NO_CONTENT_204).send();
        });
        this.createPostByBlogId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogService.findById(req.params.blogId);
            if (!blog) {
                res.status(http_status_code_2.default.NOT_FOUND_404).send("Blog not found.");
                return;
            }
            const blogCreated = yield this.blogService.createPostByBlogId(req.body, req.params.blogId);
            res.status(http_status_code_2.default.CREATED_201).json(blogCreated);
        });
    }
};
exports.BlogController = BlogController;
exports.BlogController = BlogController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blog_service_1.BlogService)),
    __param(1, (0, inversify_1.inject)(post_service_1.PostService)),
    __metadata("design:paramtypes", [blog_service_1.BlogService,
        post_service_1.PostService])
], BlogController);
//# sourceMappingURL=blog.controller.js.map