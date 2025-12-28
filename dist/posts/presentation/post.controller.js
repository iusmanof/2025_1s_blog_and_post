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
exports.PostController = void 0;
const inversify_1 = require("inversify");
const http_status_code_1 = __importDefault(require("../../core/types/http-status-code"));
const post_service_1 = require("../application/post.service");
const http_status_code_2 = __importDefault(require("../../core/types/http-status-code"));
const result_object_1 = require("../../core/types/result-object");
const http_status_code_3 = __importDefault(require("../../core/types/http-status-code"));
const jwt_adapter_1 = require("../../auth/application/adapters/jwt.adapter");
const comments_service_1 = require("../../comments/application/comments.service");
let PostController = class PostController {
    constructor(postService, commentsService, jwtAdapter) {
        this.postService = postService;
        this.commentsService = commentsService;
        this.jwtAdapter = jwtAdapter;
        this.findMany = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const result = yield this.postService.findMany(req.query, userId);
            res.status(http_status_code_1.default.OK_200).json(result);
        });
        this.findById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const postFounded = yield this.postService.findById(req.params.id, userId);
            if (!postFounded) {
                res.sendStatus(404);
                return;
            }
            res.status(200).json(postFounded);
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const postCreated = yield this.postService.create(req.body);
            const apiErrorMsg = [];
            if (!postCreated) {
                apiErrorMsg.push({ message: "ID Not found", field: "id" });
                res
                    .status(http_status_code_2.default.NOT_FOUND_404)
                    .json({ errorsMessages: apiErrorMsg });
                return;
            }
            res.status(http_status_code_2.default.CREATED_201).json(postCreated);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const postIsUpdated = yield this.postService.update(req.params.id, req.body);
            const apiErrorMsg = [];
            if (!postIsUpdated) {
                apiErrorMsg.push({ message: "ID Not found", field: "id" });
                res
                    .status(http_status_code_2.default.NOT_FOUND_404)
                    .json({ errorsMessages: apiErrorMsg });
                return;
            }
            res.status(http_status_code_2.default.NO_CONTENT_204).send();
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postService.delete(req.params.id);
            if (!post) {
                res.status(http_status_code_2.default.NOT_FOUND_404).send("Not found");
                return;
            }
            res.status(http_status_code_2.default.NO_CONTENT_204).send();
        });
        this.createComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                res.status(http_status_code_1.default.UNAUTHORIZED_401).send("Unauthorized");
                return;
            }
            const userId = req.user.id;
            const postId = req.params.postId;
            const content = req.body.content;
            const post = yield this.postService.findById(postId);
            if (!post) {
                res.status(http_status_code_1.default.NOT_FOUND_404).send("Post not found");
                return;
            }
            const result = yield this.commentsService.create(userId, postId, content);
            if (result.status === result_object_1.resultStatus.ERROR) {
                res.status(http_status_code_1.default.BAD_REQUEST_400).json(result);
                return;
            }
            res.status(http_status_code_1.default.CREATED_201).json(result.data);
        });
        this.getComments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.postId;
            const query = req.query;
            const post = yield this.postService.findById(postId);
            if (!post) {
                res.status(http_status_code_1.default.NOT_FOUND_404).send("Post not found");
                return;
            }
            let userId = null;
            const authHeader = req.headers.authorization;
            const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))
                ? authHeader.split(" ")[1]
                : null;
            if (token) {
                try {
                    const payload = (yield this.jwtAdapter.verifyAccessToken(token));
                    if (payload) {
                        userId = payload.id;
                    }
                }
                catch (_a) { }
            }
            const result = yield this.commentsService.getCommentByPostId(postId, query, userId);
            if (!result) {
                res.status(http_status_code_1.default.NOT_FOUND_404).send("Not found");
                return;
            }
            res.status(http_status_code_3.default.OK_200).json(result.data);
        });
        this.getLikeStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { postId } = req.params;
            const { likeStatus } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.sendStatus(http_status_code_2.default.UNAUTHORIZED_401);
                return;
            }
            const result = yield this.postService.getLikeStatus(postId, userId, likeStatus);
            if (!result) {
                res.sendStatus(http_status_code_2.default.NOT_FOUND_404);
                return;
            }
            res.sendStatus(http_status_code_3.default.NO_CONTENT_204);
        });
    }
};
exports.PostController = PostController;
exports.PostController = PostController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(post_service_1.PostService)),
    __param(1, (0, inversify_1.inject)(comments_service_1.CommentsService)),
    __param(2, (0, inversify_1.inject)(jwt_adapter_1.JwtAdapter)),
    __metadata("design:paramtypes", [post_service_1.PostService,
        comments_service_1.CommentsService,
        jwt_adapter_1.JwtAdapter])
], PostController);
//# sourceMappingURL=post.controller.js.map