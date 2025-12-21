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
const inversify_1 = require("inversify");
const result_object_1 = require("../../core/types/result-object");
const comments_repository_1 = require("../infrastructure/comments.repository");
const like_1 = require("../types/like");
let CommentsService = class CommentsService {
    constructor(commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
    create(userId, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = yield this.commentsRepository.create(userId, postId, content);
            if (!newComment) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Failed to create a comment",
                    data: null,
                    extensions: [],
                };
            }
            const myStatus = like_1.LikeStatus.None;
            const resultComment = Object.assign(Object.assign({}, newComment), { likesInfo: Object.assign(Object.assign({}, newComment.likesInfo), { myStatus: myStatus }) });
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: resultComment,
            };
        });
    }
    getCommentByPostId(postId, query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Получаем комментарии с пагинацией
            const commentsPage = yield this.commentsRepository.getCommentsByPostId(postId, query);
            if (!commentsPage) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Comments not found",
                    data: null,
                    extensions: [],
                };
            }
            // Добавляем myStatus для текущего пользователя
            const itemsWithStatus = yield Promise.all(commentsPage.items.map((comment) => __awaiter(this, void 0, void 0, function* () {
                let myStatus = like_1.LikeStatus.None;
                if (userId) {
                    const statusCurrentUser = yield this.commentsRepository.getStatusByUserId(comment.id, userId);
                    if (statusCurrentUser && statusCurrentUser.status) {
                        myStatus =
                            like_1.LikeStatus[statusCurrentUser.status];
                    }
                }
                return Object.assign(Object.assign({}, comment), { likesInfo: Object.assign(Object.assign({}, comment.likesInfo), { myStatus }) });
            })));
            // Возвращаем объект с пагинацией и items с myStatus
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: {
                    pagesCount: commentsPage.pagesCount,
                    page: commentsPage.page,
                    pageSize: commentsPage.pageSize,
                    totalCount: commentsPage.totalCount,
                    items: itemsWithStatus,
                },
            };
        });
    }
    getByCommentId(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsRepository.getCommentById(commentId);
            if (!comment) {
                return {
                    status: result_object_1.resultStatus.NOT_FOUND,
                    errorMessages: "Failed to get a comment",
                    data: null,
                    extensions: [],
                };
            }
            if (userId === null) {
                const commentForUnauthorized = {
                    id: comment.id,
                    content: comment.content,
                    commentatorInfo: comment.commentatorInfo,
                    likesInfo: Object.assign(Object.assign({}, comment.likesInfo), { myStatus: "None" }),
                    createdAt: comment.createdAt,
                };
                return {
                    status: result_object_1.resultStatus.SUCCESS,
                    extensions: [],
                    data: commentForUnauthorized,
                };
            }
            const statusCurrentUser = userId
                ? yield this.commentsRepository.getStatusByUserId(commentId, userId)
                : null;
            let myStatus = like_1.LikeStatus.None;
            if (statusCurrentUser && statusCurrentUser.status) {
                myStatus =
                    like_1.LikeStatus[statusCurrentUser.status];
            }
            const commentWithStatus = Object.assign(Object.assign({}, comment), { likesInfo: Object.assign(Object.assign({}, comment.likesInfo), { myStatus }) });
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: commentWithStatus,
            };
        });
    }
    deleteById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsRepository.deleteById(commentId);
            if (!result) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Failed to delete a comment",
                    data: null,
                    extensions: [],
                };
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: result,
            };
        });
    }
    updateById(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsRepository.updateById(commentId, content);
            if (!result) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Failed to update a comment",
                    data: null,
                    extensions: [],
                };
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: result,
            };
        });
    }
    setLikeStatus(commentId, newLikeStatusString, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(newLikeStatusString in like_1.LikeStatus)) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Is invalid",
                    data: null,
                    extensions: [],
                };
            }
            const comment = yield this.commentsRepository.getCommentById(commentId);
            if (!comment) {
                return {
                    status: result_object_1.resultStatus.NOT_FOUND,
                    errorMessages: "id not found",
                    data: null,
                    extensions: [],
                };
            }
            const newlikeStatus = like_1.LikeStatus[newLikeStatusString];
            const currentLikeStatusUser = yield this.commentsRepository.getStatusByUserId(commentId, userId);
            const currentStatus = currentLikeStatusUser
                ? currentLikeStatusUser.status
                : like_1.LikeStatus.None;
            const { likesCount, dislikesCount, finalStatus } = this.updateReaction(currentStatus, newlikeStatus, comment.likesInfo.likesCount, comment.likesInfo.dislikesCount);
            yield this.commentsRepository.updateStatusByUserId(commentId, userId, finalStatus);
            yield this.commentsRepository.setCommentLikeStatus(comment.id, likesCount, dislikesCount);
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: {},
            };
        });
    }
    updateReaction(currentStatus, newStatus, likesCount, dislikesCount) {
        if (currentStatus === newStatus) {
            return { likesCount, dislikesCount, finalStatus: currentStatus };
        }
        if (currentStatus === like_1.LikeStatus.Like && likesCount > 0) {
            likesCount--;
        }
        if (currentStatus === like_1.LikeStatus.Dislike && dislikesCount > 0) {
            dislikesCount--;
        }
        if (newStatus === like_1.LikeStatus.Like) {
            likesCount++;
        }
        if (newStatus === like_1.LikeStatus.Dislike) {
            dislikesCount++;
        }
        return { likesCount, dislikesCount, finalStatus: newStatus };
    }
};
CommentsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comments_repository_1.CommentsRepository)),
    __metadata("design:paramtypes", [comments_repository_1.CommentsRepository])
], CommentsService);
exports.default = CommentsService;
//# sourceMappingURL=comments.service.js.map