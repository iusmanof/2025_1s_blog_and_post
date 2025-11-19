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
exports.BlogService = void 0;
class BlogService {
    constructor(blogsRepository) {
        this.blogsRepository = blogsRepository;
    }
    findMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.getAllBlogs(query);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.getBlogById(id);
        });
    }
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.createBlog(body);
        });
    }
    createPostByBlogId(body, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.createPostByBlogId(body, blogId);
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.updateBlog(id, body);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.deleteBlog(id);
        });
    }
}
exports.BlogService = BlogService;
//# sourceMappingURL=blog.service.js.map