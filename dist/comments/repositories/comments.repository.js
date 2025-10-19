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
exports.commentsRepository = void 0;
const mongo_db_1 = require("../../core/db/mongo.db");
const users_query_repository_1 = require("../../users/repositories/users.query.repository");
const mongodb_1 = require("mongodb");
exports.commentsRepository = {
    create(userId, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield users_query_repository_1.usersQueryRepository.findById(userId);
            if (!userData) {
                return null;
            }
            const comment = {
                postId: postId,
                content: content,
                commentatorInfo: {
                    userId: userData.id,
                    userLogin: userData.login
                },
                createdAt: new Date().toISOString()
            };
            const result = yield (0, mongo_db_1.getCommentCollection)().insertOne(comment);
            return {
                commentatorInfo: comment.commentatorInfo,
                content: comment.content,
                createdAt: comment.createdAt,
                id: result.insertedId.toString(),
            };
        });
    },
    getCommentsByPostId(postId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' } = query;
            const skip = (pageNumber - 1) * pageSize;
            const sortDir = sortDirection === 'asc' ? 1 : -1;
            const search = { postId: postId };
            const result = yield (0, mongo_db_1.getCommentCollection)()
                .find(search)
                .sort({ [sortBy]: sortDir })
                .skip(+skip)
                .limit(+pageSize)
                .toArray();
            if (!result) {
                return null;
            }
            const totalCount = (yield (0, mongo_db_1.getCommentCollection)().find(search).toArray()).length;
            const commentsWithInfo = {
                pagesCount: +Math.ceil(totalCount / pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: +totalCount,
                items: result.map(comment => ({
                    id: comment._id.toString(),
                    content: comment.content,
                    commentatorInfo: comment.commentatorInfo,
                    createdAt: comment.createdAt,
                }))
            };
            return commentsWithInfo;
        });
    },
    getCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, mongo_db_1.getCommentCollection)().findOne({ _id: new mongodb_1.ObjectId(commentId) });
            if (!result) {
                return null;
            }
            return {
                id: result._id.toString(),
                content: result.content,
                commentatorInfo: result.commentatorInfo,
                createdAt: result.createdAt,
            };
        });
    }
};
//# sourceMappingURL=comments.repository.js.map