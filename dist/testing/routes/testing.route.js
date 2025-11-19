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
const composition_root_1 = require("../../composition.root");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield composition_root_1.blogsRepository.deleteAllBlogs();
    yield composition_root_1.postsRepository.deleteAllPosts();
    yield composition_root_1.usersRepository.deleteAllUsers();
    yield composition_root_1.commentsRepository.deleteAllComments();
    yield composition_root_1.authRepository.deleteRefreshTokenBlackList();
    yield composition_root_1.securityDevicesRepository.deleteAllDevices();
    res.status(204).send("All data is deleted");
}));
//# sourceMappingURL=testing.route.js.map