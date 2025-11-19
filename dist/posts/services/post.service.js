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
exports.PostService = void 0;
class PostService {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    findMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.getAllPosts(query);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.getPostById(id);
        });
    }
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.createPost(body);
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
    findPostsByBlogId(blogId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.getPostByBlogId(blogId, query);
        });
    }
}
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map