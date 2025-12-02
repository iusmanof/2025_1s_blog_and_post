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
const users_query_repository_1 = require("../../users/repositories/users.query.repository");
const user_entity_1 = require("../../users/domain/user.entity");
const comments_entiry_1 = require("../domain/comments.entiry");
let CommentsRepository = class CommentsRepository {
    constructor(usersQueryRepository) {
        this.usersQueryRepository = usersQueryRepository;
    }
    create(userId, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield user_entity_1.UserMongooseModel.findById(userId);
            if (!userData) {
                return null;
            }
            const comment = {
                postId: postId,
                content: content,
                commentatorInfo: {
                    userId: userData.id,
                    userLogin: userData.login,
                },
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None",
                },
                createdAt: new Date().toISOString(),
            };
            return yield comments_entiry_1.CommentMongooseModel.create(comment);
        });
    }
    getCommentsByPostId(postId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc", } = query;
            const skip = (pageNumber - 1) * pageSize;
            const sortDir = sortDirection === "asc" ? 1 : -1;
            const search = { postId: postId };
            const result = yield comments_entiry_1.CommentMongooseModel.find(search)
                .sort({ [sortBy]: sortDir })
                .skip(+skip)
                .limit(+pageSize)
                .exec();
            if (!result) {
                return null;
            }
            const totalCount = (yield comments_entiry_1.CommentMongooseModel.find(search).exec()).length;
            return {
                pagesCount: +Math.ceil(totalCount / pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: +totalCount,
                items: result.map((comment) => ({
                    id: comment._id.toString(),
                    content: comment.content,
                    commentatorInfo: comment.commentatorInfo,
                    createdAt: comment.createdAt,
                })),
            };
        });
    }
    getCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_entiry_1.CommentMongooseModel.findOne({
                _id: new mongodb_1.ObjectId(commentId),
            });
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
    deleteById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_entiry_1.CommentMongooseModel.deleteOne({
                _id: new mongodb_1.ObjectId(commentId),
            });
            if (result.deletedCount === 0) {
                return null;
            }
            return result;
        });
    }
    deleteAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            yield comments_entiry_1.CommentMongooseModel.deleteMany({});
        });
    }
    updateById(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_entiry_1.CommentMongooseModel.updateOne({ _id: new mongodb_1.ObjectId(commentId) }, { $set: { content: content } });
            if (result.matchedCount === 0) {
                return null;
            }
            return result;
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