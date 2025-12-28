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
const inversify_1 = require("inversify");
const mongodb_1 = require("mongodb");
const blogs_repository_1 = require("../../blogs/infrastructure/blogs.repository");
const post_mongo_1 = require("./post.mongo");
const blog_mongo_1 = require("../../blogs/infrastructure/blog.mongo");
const mongoose_1 = __importDefault(require("mongoose"));
let PostsRepository = class PostsRepository {
    constructor(blogsRepository) {
        this.blogsRepository = blogsRepository;
    }
    createPost(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.isValidObjectId(dto.blogId)) {
                throw new Error("Blog not found");
            }
            const blogId = new mongoose_1.default.Types.ObjectId(dto.blogId);
            const blog = yield blog_mongo_1.BlogModel.findById(blogId);
            if (!blog)
                throw new Error("Blog not found");
            const post = post_mongo_1.PostModel.createPost(Object.assign(Object.assign({}, dto), { blogId: dto.blogId, blogName: blog.name }));
            yield post.save();
            return post;
        });
    }
    getAllPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc", } = query;
            const skip = (pageNumber - 1) * pageSize;
            const sortDir = sortDirection === "asc" ? 1 : -1;
            const items = yield post_mongo_1.PostModel.find({})
                .sort({ [sortBy]: sortDir })
                .skip(+skip)
                .limit(+pageSize)
                .exec();
            const totalCount = yield post_mongo_1.PostModel.countDocuments({});
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize,
                totalCount,
                items,
            };
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return null;
            }
            return post_mongo_1.PostModel.findById(id).exec();
        });
    }
    updatePost(id, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield post_mongo_1.PostModel.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                },
            });
            return result.matchedCount === 1;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield post_mongo_1.PostModel.deleteOne({
                _id: new mongodb_1.ObjectId(id),
            });
            return result.deletedCount === 1;
        });
    }
    deleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield post_mongo_1.PostModel.deleteMany({});
        });
    }
    getPostByBlogId(blogId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc", } = query;
            const skip = (pageNumber - 1) * pageSize;
            const sortDir = sortDirection === "asc" ? 1 : -1;
            const items = yield post_mongo_1.PostModel.find({ blogId })
                .sort({ [sortBy]: sortDir })
                .skip(+skip)
                .limit(+pageSize)
                .exec();
            const totalCount = yield post_mongo_1.PostModel.countDocuments({ blogId });
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize,
                totalCount,
                items,
            };
        });
    }
};
PostsRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_repository_1.BlogsRepository)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository])
], PostsRepository);
exports.default = PostsRepository;
//# sourceMappingURL=posts.repository.js.map