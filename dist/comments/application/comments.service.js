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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const inversify_1 = require("inversify");
const comments_repository_1 = require("../infrastructure/comments.repository");
const comment_entity_1 = require("../domain/comment.entity");
const result_object_1 = require("../../core/types/result-object");
const like_1 = require("../types/like");
let CommentsService = class CommentsService {
    constructor(commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
    create(userId, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentEntity = new comment_entity_1.CommentEntity({ userId, postId, content });
            const comment = yield this.commentsRepository.create(commentEntity);
            if (!comment)
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Failed to create comment",
                    data: null,
                    extensions: [],
                };
            comment.likesInfo.myStatus = like_1.LikeStatus.None;
            return { status: result_object_1.resultStatus.SUCCESS, data: comment, extensions: [] };
        });
    }
    getByCommentId(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsRepository.getCommentById(commentId);
            if (!comment) {
                return {
                    status: result_object_1.resultStatus.NOT_FOUND,
                    errorMessages: "Comment not found",
                    data: null,
                    extensions: [],
                };
            }
            let myStatus = like_1.LikeStatus.None;
            if (userId) {
                const statusCurrentUser = yield this.commentsRepository.getStatusByUserId(commentId, userId);
                if (statusCurrentUser === null || statusCurrentUser === void 0 ? void 0 : statusCurrentUser.status) {
                    myStatus =
                        like_1.LikeStatus[statusCurrentUser.status];
                }
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: Object.assign(Object.assign({}, comment), { likesInfo: Object.assign(Object.assign({}, comment.likesInfo), { myStatus }) }),
            };
        });
    }
    getCommentByPostId(postId, query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this.commentsRepository.getCommentsByPostId(postId, query);
            if (!page)
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Comments not found",
                    data: null,
                    extensions: [],
                };
            for (const comment of page.items) {
                comment.likesInfo.myStatus = like_1.LikeStatus.None;
                if (userId) {
                    const status = yield this.commentsRepository.getStatusByUserId(comment.id, userId);
                    if (status === null || status === void 0 ? void 0 : status.status)
                        comment.likesInfo.myStatus = status.status;
                }
            }
            return { status: result_object_1.resultStatus.SUCCESS, data: page, extensions: [] };
        });
    }
    setLikeStatus(commentId, newLikeStatus, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(newLikeStatus in like_1.LikeStatus))
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Invalid status",
                    data: null,
                    extensions: [],
                };
            const comment = yield this.commentsRepository.setLikeStatus(commentId, newLikeStatus, userId);
            if (!comment)
                return {
                    status: result_object_1.resultStatus.NOT_FOUND,
                    errorMessages: "Comment not found",
                    data: null,
                    extensions: [],
                };
            return { status: result_object_1.resultStatus.SUCCESS, data: {}, extensions: [] };
        });
    }
    deleteById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsRepository.deleteById(commentId);
            if (!result)
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Failed to delete",
                    data: null,
                    extensions: [],
                };
            return { status: result_object_1.resultStatus.SUCCESS, data: result, extensions: [] };
        });
    }
    updateById(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsRepository.updateById(commentId, content);
            if (!result)
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Failed to update",
                    data: null,
                    extensions: [],
                };
            return { status: result_object_1.resultStatus.SUCCESS, data: result, extensions: [] };
        });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comments_repository_1.CommentsRepository)),
    __metadata("design:paramtypes", [comments_repository_1.CommentsRepository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map