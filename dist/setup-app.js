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
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const paths_1 = require("./core/paths/paths");
const blog_route_1 = require("./blogs/routes/blog.route");
const post_route_1 = require("./posts/routes/post.route");
const testing_route_1 = require("./testing/routes/testing.route");
const users_route_1 = require("./users/routes/users.route");
const auth_routes_1 = require("./auth/routes/auth.routes");
const comments_route_1 = require("./comments/routes/comments.route");
const setupApp = (app) => {
    app.use(express_1.default.json());
    app.use(paths_1.BLOGS_PATH, blog_route_1.blogRouter);
    app.use(paths_1.POSTS_PATH, post_route_1.postRouter);
    app.use(paths_1.USERS_PATH, users_route_1.userRouter);
    app.use(paths_1.TESTING_PATH, testing_route_1.testingRouter);
    app.use(paths_1.AUTH_PATH, auth_routes_1.authRouter);
    app.use(paths_1.COMMENTS_PATH, comments_route_1.commentsRouter);
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield res.send("blogs api");
    }));
    return app;
};
exports.setupApp = setupApp;
//# sourceMappingURL=setup-app.js.map