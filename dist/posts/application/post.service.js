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
exports.PostService = void 0;
const inversify_1 = require("inversify");
const posts_repository_1 = __importDefault(require("../infrastructure/posts.repository"));
const post_mapper_1 = require("./post.mapper");
const users_repository_1 = require("../../users/infrastructure/users.repository");
let PostService = class PostService {
    constructor(postsRepository, usersRepository) {
        this.postsRepository = postsRepository;
        this.usersRepository = usersRepository;
    }
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsRepository.createPost(body);
            return (0, post_mapper_1.mapPostToView)(post);
        });
    }
    findMany(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.postsRepository.getAllPosts(query);
            return Object.assign(Object.assign({}, posts), { items: yield Promise.all(posts.items.map((p) => (0, post_mapper_1.mapPostToView)(p, userId))) });
        });
    }
    findById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsRepository.getPostById(id);
            if (!post)
                return null;
            return (0, post_mapper_1.mapPostToView)(post, userId);
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.updatePost(id, body);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.deletePost(id);
        });
    }
    findPostsByBlogId(blogId, query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { items, totalCount, pagesCount, page, pageSize } = yield this.postsRepository.getPostByBlogId(blogId, query);
            const mappedItems = yield Promise.all(items.map((post) => (0, post_mapper_1.mapPostToView)(post, userId)));
            return {
                pagesCount,
                page,
                pageSize,
                totalCount,
                items: mappedItems,
            };
        });
    }
    getLikeStatus(postId, userId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsRepository.getPostById(postId);
            if (!post)
                return null;
            const user = yield this.usersRepository.findById(userId);
            if (!user)
                return null;
            const currentStatus = yield post.setLikeStatus(userId, user.login, likeStatus);
            return { likeStatus: currentStatus };
        });
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_repository_1.default)),
    __param(1, (0, inversify_1.inject)(users_repository_1.UsersRepository)),
    __metadata("design:paramtypes", [posts_repository_1.default,
        users_repository_1.UsersRepository])
], PostService);
//# sourceMappingURL=post.service.js.map