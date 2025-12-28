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
exports.CommentsRepository = void 0;
const inversify_1 = require("inversify");
const mongodb_1 = require("mongodb");
const users_query_repository_1 = require("../../users/infrastructure/users.query.repository");
const user_mongo_1 = require("../../users/infrastructure/user.mongo");
const comments_mongo_1 = require("./comments.mongo");
let CommentsRepository = class CommentsRepository {
    constructor(usersQueryRepository) {
        this.usersQueryRepository = usersQueryRepository;
    }
    create(commentEntity) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_mongo_1.UserModel.findById(commentEntity.getUserId());
            if (!user)
                return null;
            const comment = yield comments_mongo_1.CommentMongooseModel.createFromEntity({
                userId: commentEntity.getUserId(),
                postId: commentEntity.getPostId(),
                content: commentEntity.getContent(),
                userLogin: user.login,
            });
            return comment.toJSON();
        });
    }
    getCommentsByPostId(postId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc", } = query;
            const skip = (pageNumber - 1) * pageSize;
            const sortDir = sortDirection === "asc" ? 1 : -1;
            const items = yield comments_mongo_1.CommentMongooseModel.find({ postId })
                .sort({ [sortBy]: sortDir })
                .skip(skip)
                .limit(pageSize)
                .lean();
            const totalCount = yield comments_mongo_1.CommentMongooseModel.countDocuments({ postId });
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize,
                totalCount,
                items: items.map((c) => ({
                    id: c._id.toString(),
                    content: c.content,
                    commentatorInfo: c.commentatorInfo,
                    likesInfo: c.likesInfo,
                    createdAt: c.createdAt,
                })),
            };
        });
    }
    getCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comments_mongo_1.CommentMongooseModel.findById(commentId).lean();
            if (!comment)
                return null;
            return {
                id: comment._id.toString(),
                content: comment.content,
                commentatorInfo: comment.commentatorInfo,
                likesInfo: comment.likesInfo,
                createdAt: comment.createdAt,
            };
        });
    }
    deleteById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_mongo_1.CommentMongooseModel.deleteOne({
                _id: new mongodb_1.ObjectId(commentId),
            });
            return result.deletedCount === 0 ? null : result;
        });
    }
    updateById(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_mongo_1.CommentMongooseModel.updateOne({ _id: new mongodb_1.ObjectId(commentId) }, { $set: { content } });
            return result.matchedCount === 0 ? null : result;
        });
    }
    setLikeStatus(commentId, newLikeStatus, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comments_mongo_1.CommentMongooseModel.findById(commentId);
            if (!comment)
                return null;
            const currentStatus = yield comments_mongo_1.CommentReactionModel.findOne({
                commentId,
                userId,
            }).lean();
            const oldStatus = (currentStatus === null || currentStatus === void 0 ? void 0 : currentStatus.status) || "None";
            comment.updateReaction(oldStatus, newLikeStatus);
            yield comment.save();
            yield comments_mongo_1.CommentReactionModel.updateOne({ commentId, userId }, { status: newLikeStatus }, { upsert: true });
            return comment.toJSON();
        });
    }
    getStatusByUserId(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_mongo_1.CommentReactionModel.findOne({ commentId, userId }).lean();
        });
    }
    deleteAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_mongo_1.CommentMongooseModel.deleteMany({});
            return result.deletedCount === 0 ? null : result;
        });
    }
};
exports.CommentsRepository = CommentsRepository;
exports.CommentsRepository = CommentsRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(users_query_repository_1.UsersQueryRepository)),
    __metadata("design:paramtypes", [users_query_repository_1.UsersQueryRepository])
], CommentsRepository);
//# sourceMappingURL=comments.repository.js.map