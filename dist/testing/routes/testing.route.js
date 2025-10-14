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
exports.testingRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../../blogs/repositories/blogs.repository");
const posts_repository_1 = require("../../posts/repositories/posts.repository");
const users_repository_1 = require("../../users/repositories/users.repository");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogs_repository_1.blogsRepository.deleteAllBlogs();
    yield posts_repository_1.postsRepository.deleteAllPosts();
    yield users_repository_1.usersRepository.deleteAllUsers();
    res.status(204).send("All data is deleted");
}));
//# sourceMappingURL=testing.route.js.map