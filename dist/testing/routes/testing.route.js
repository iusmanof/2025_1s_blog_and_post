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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
require("reflect-metadata");
const composition_root_1 = require("../../composition.root");
const express_1 = require("express");
const auth_repository_1 = require("../../auth/repositories/auth.repository");
const blogs_repository_1 = require("../../blogs/infrastructure/blogs.repository");
const comments_repository_1 = require("../../comments/repositories/comments.repository");
const posts_repository_1 = __importDefault(require("../../posts/infrastructure/posts.repository"));
const security_devices_repository_1 = require("../../auth/repositories/security-devices.repository");
const users_repository_1 = require("../../users/repositories/users.repository");
const authRepository = composition_root_1.container.get(auth_repository_1.AuthRepository);
const blogsRepository = composition_root_1.container.get(blogs_repository_1.BlogsRepository);
const commentsRepository = composition_root_1.container.get(comments_repository_1.CommentsRepository);
const postsRepository = composition_root_1.container.get(posts_repository_1.default);
const securityDevicesRepository = composition_root_1.container.get(security_devices_repository_1.SecurityDevicesRepository);
const usersRepository = composition_root_1.container.get(users_repository_1.UsersRepository);
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogsRepository.deleteAllBlogs();
    yield postsRepository.deleteAllPosts();
    yield usersRepository.deleteAllUsers();
    yield commentsRepository.deleteAllComments();
    yield authRepository.deleteRefreshTokenBlackList();
    yield securityDevicesRepository.deleteAllDevices();
    res.status(204).send("All data is deleted");
}));
//# sourceMappingURL=testing.route.js.map