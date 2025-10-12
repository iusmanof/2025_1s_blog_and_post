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
const posts_repository_1 = require("../repositories/posts.repository");
const PostService = {
    findMany: (query) => __awaiter(void 0, void 0, void 0, function* () {
        // Business logic layer
        return yield posts_repository_1.postsRepository.getAllPosts(query);
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        // Business logic layer
        return yield posts_repository_1.postsRepository.getPostById(id);
    }),
    create: (body) => __awaiter(void 0, void 0, void 0, function* () {
        // Business logic layer
        return yield posts_repository_1.postsRepository.createPost(body);
    }),
    update: (id, body) => __awaiter(void 0, void 0, void 0, function* () {
        // Business logic layer
        return yield posts_repository_1.postsRepository.updatePost(id, body);
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        // Business logic layer
        return yield posts_repository_1.postsRepository.deletePost(id);
    }),
    findPostsByBlogId: (blogId, query) => __awaiter(void 0, void 0, void 0, function* () {
        // Business logic layer
        return yield posts_repository_1.postsRepository.getPostByBlogId(blogId, query);
    })
};
exports.default = PostService;
//# sourceMappingURL=post.service.js.map