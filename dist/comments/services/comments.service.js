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
const comments_repository_1 = require("../repositories/comments.repository");
let CommentsService = class CommentsService {
    constructor(commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
    create(userId, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentsInfo = yield this.commentsRepository.create(userId, postId, content);
            if (!commentsInfo) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Failed to create a comment",
                    data: null,
                    extensions: [],
                };
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: commentsInfo,
            };
        });
    }
    getCommentByPostId(postId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield this.commentsRepository.getCommentsByPostId(postId, query);
            if (!comments) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Comments not found",
                    data: null,
                    extensions: [],
                };
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: comments,
            };
        });
    }
    getByCommentId(commentId) {
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
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: comment,
            };
        });
    }
    getCommentById(commentId, userId) {
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
            if (comment.commentatorInfo.userId !== userId) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "UserId not found",
                    data: null,
                    extensions: [],
                };
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: comment,
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
};
CommentsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comments_repository_1.CommentsRepository)),
    __metadata("design:paramtypes", [comments_repository_1.CommentsRepository])
], CommentsService);
exports.default = CommentsService;
//# sourceMappingURL=comments.service.js.map