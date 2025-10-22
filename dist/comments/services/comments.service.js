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
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsService = void 0;
const result_object_1 = require("../../core/types/result-object");
const comments_repository_1 = require("../repositories/comments.repository");
exports.commentsService = {
    create(userId, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentsInfo = yield comments_repository_1.commentsRepository.create(userId, postId, content);
            if (!commentsInfo) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: 'Failed to create a comment',
                    data: null,
                    extensions: []
                };
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: commentsInfo
            };
        });
    },
    getCommentByPostId(postId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield comments_repository_1.commentsRepository.getCommentsByPostId(postId, query);
            if (!comments) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: 'Comments not found',
                    data: null,
                    extensions: []
                };
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: comments
            };
        });
    },
    getCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comments_repository_1.commentsRepository.getCommentById(commentId);
            if (!comment) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: 'Failed to get a comment',
                    data: null,
                    extensions: []
                };
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: comment
            };
        });
    },
    deleteById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_repository_1.commentsRepository.deleteById(commentId);
            if (!result) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: 'Failed to delete a comment',
                    data: null,
                    extensions: []
                };
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: result
            };
        });
    },
    updateById(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_repository_1.commentsRepository.updateById(commentId, content);
            if (!result) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: 'Failed to update a comment',
                    data: null,
                    extensions: []
                };
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: result
            };
        });
    },
    findById() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
};
//# sourceMappingURL=comments.service.js.map