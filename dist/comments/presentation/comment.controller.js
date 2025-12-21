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
exports.CommentController = void 0;
const inversify_1 = require("inversify");
const comments_service_1 = __importDefault(require("../application/comments.service"));
const result_object_1 = require("../../core/types/result-object");
const http_status_code_1 = __importDefault(require("../../core/types/http-status-code"));
const jwt_adapter_1 = require("../../auth/application/adapters/jwt.adapter");
let CommentController = class CommentController {
    constructor(commentsService, jwtAdapter) {
        this.commentsService = commentsService;
        this.jwtAdapter = jwtAdapter;
        this.getByCommentId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const commentId = req.params.id;
            // add userId
            let userId = null;
            const authHeader = req.headers.authorization;
            const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))
                ? authHeader.split(" ")[1]
                : null;
            if (token) {
                try {
                    const payload = yield this.jwtAdapter.verifyAccessToken(token);
                    userId = payload.id;
                }
                catch (_a) { }
            }
            const result = yield this.commentsService.getByCommentId(commentId, userId);
            if (result.status === result_object_1.resultStatus.NOT_FOUND) {
                res.status(http_status_code_1.default.NOT_FOUND_404).send("Not Found");
                return;
            }
            res.status(http_status_code_1.default.OK_200).send(result.data);
        });
        this.deleteById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const commentId = req.params.id;
            const userId = req.user.id;
            //getCommentById
            const comment = yield this.commentsService.getByCommentId(commentId, userId);
            if (comment.status == result_object_1.resultStatus.NOT_FOUND) {
                res.status(http_status_code_1.default.NOT_FOUND_404).send("Comment not found");
                return;
            }
            if (comment.status == result_object_1.resultStatus.ERROR) {
                res
                    .status(http_status_code_1.default.FORBIDDEN_403)
                    .send("If try delete the comment that is not your own");
                return;
            }
            const result = yield this.commentsService.deleteById(commentId);
            if (result.status === result_object_1.resultStatus.ERROR) {
                res.status(http_status_code_1.default.NOT_FOUND_404).send("Comment not found");
                return;
            }
            if (result.status === result_object_1.resultStatus.SUCCESS) {
                res.status(http_status_code_1.default.NO_CONTENT_204).send();
                return;
            }
        });
        this.updateById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const commentId = req.params.id;
            const content = req.body.content;
            const userId = req.user.id;
            //getCommentById
            const comment = yield this.commentsService.getByCommentId(commentId, userId);
            if (comment.status == result_object_1.resultStatus.NOT_FOUND) {
                res.status(http_status_code_1.default.NOT_FOUND_404).send("Comment not found");
                return;
            }
            if (comment.status == result_object_1.resultStatus.ERROR) {
                res
                    .status(http_status_code_1.default.FORBIDDEN_403)
                    .send("If try delete the comment that is not your own");
                return;
            }
            const result = yield this.commentsService.updateById(commentId, content);
            if (result.status === result_object_1.resultStatus.ERROR) {
                res.status(http_status_code_1.default.NOT_FOUND_404).send("Comment not updated");
                return;
            }
            if (result.status === result_object_1.resultStatus.SUCCESS) {
                res.status(http_status_code_1.default.NO_CONTENT_204).send("Updated successfully");
                return;
            }
        });
        this.setLikeStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const commentId = req.params.id;
            const likeStatus = req.body.likeStatus;
            const userId = req.user.id;
            const result = yield this.commentsService.setLikeStatus(commentId, likeStatus, userId);
            if (result.status === result_object_1.resultStatus.ERROR) {
                res.status(http_status_code_1.default.BAD_REQUEST_400).send("Comment is invalid");
                return;
            }
            if (result.status === result_object_1.resultStatus.NOT_FOUND) {
                res.status(http_status_code_1.default.NOT_FOUND_404).send("Comment not founded");
                return;
            }
            if (result.status === result_object_1.resultStatus.SUCCESS) {
                res.status(http_status_code_1.default.NO_CONTENT_204).send("Update like status");
                return;
            }
        });
    }
};
exports.CommentController = CommentController;
exports.CommentController = CommentController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comments_service_1.default)),
    __param(1, (0, inversify_1.inject)(jwt_adapter_1.JwtAdapter)),
    __metadata("design:paramtypes", [comments_service_1.default,
        jwt_adapter_1.JwtAdapter])
], CommentController);
//# sourceMappingURL=comment.controller.js.map