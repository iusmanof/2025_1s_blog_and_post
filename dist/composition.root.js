"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const users_repository_1 = require("./users/infrastructure/users.repository");
const bcrypt_adapter_1 = require("./auth/adapters/bcrypt.adapter");
const users_service_1 = require("./users/application/users.service");
const email_adapter_1 = require("./auth/adapters/email.adapter");
const jwt_adapter_1 = require("./auth/adapters/jwt.adapter");
const auth_repository_1 = require("./auth/repositories/auth.repository");
const security_devices_query_repository_1 = require("./auth/repositories/security-devices.query-repository");
const security_devices_repository_1 = require("./auth/repositories/security-devices.repository");
const auth_service_1 = require("./auth/services/auth.service");
const security_devices_service_1 = require("./auth/services/security-devices.service");
const blogs_repository_1 = require("./blogs/infrastructure/blogs.repository");
const blog_service_1 = require("./blogs/application/blog.service");
const comments_service_1 = __importDefault(require("./comments/services/comments.service"));
const comments_repository_1 = require("./comments/repositories/comments.repository");
const posts_repository_1 = __importDefault(require("./posts/infrastructure/posts.repository"));
const post_service_1 = require("./posts/application/post.service");
const users_query_repository_1 = require("./users/infrastructure/users.query.repository");
const blog_controller_1 = require("./blogs/presentation/blog.controller");
const comment_controller_1 = require("./comments/controllers/comment.controller");
const post_controller_1 = require("./posts/presentation/post.controller");
const user_controller_1 = require("./users/presentation/user.controller");
const auth_controller_1 = require("./auth/controllers/auth.controller");
const security_devices_controller_1 = require("./auth/controllers/security-devices.controller");
exports.container = new inversify_1.Container();
// Adapters
exports.container.bind(bcrypt_adapter_1.BcryptAdapter).to(bcrypt_adapter_1.BcryptAdapter);
exports.container.bind(jwt_adapter_1.JwtAdapter).to(jwt_adapter_1.JwtAdapter);
exports.container.bind(email_adapter_1.EmailAdapter).to(email_adapter_1.EmailAdapter);
exports.container.bind(email_adapter_1.EmailAdapterRecoveryPassword).to(email_adapter_1.EmailAdapterRecoveryPassword);
exports.container.bind(email_adapter_1.EmailAdapterYandex).to(email_adapter_1.EmailAdapterYandex);
// Controllers
exports.container.bind(blog_controller_1.BlogController).to(blog_controller_1.BlogController);
exports.container.bind(comment_controller_1.CommentController).to(comment_controller_1.CommentController);
exports.container.bind(post_controller_1.PostController).to(post_controller_1.PostController);
exports.container.bind(user_controller_1.UserController).to(user_controller_1.UserController);
exports.container.bind(auth_controller_1.AuthController).to(auth_controller_1.AuthController);
exports.container.bind(security_devices_controller_1.SecurityDeviceController).to(security_devices_controller_1.SecurityDeviceController);
// Services
exports.container.bind(users_service_1.UsersService).to(users_service_1.UsersService);
exports.container.bind(post_service_1.PostService).to(post_service_1.PostService);
exports.container.bind(blog_service_1.BlogService).to(blog_service_1.BlogService);
exports.container.bind(security_devices_service_1.SecurityDevicesService).to(security_devices_service_1.SecurityDevicesService);
exports.container.bind(auth_service_1.AuthService).to(auth_service_1.AuthService);
exports.container.bind(comments_service_1.default).to(comments_service_1.default);
// Repositories
exports.container.bind(users_repository_1.UsersRepository).to(users_repository_1.UsersRepository);
exports.container.bind(posts_repository_1.default).to(posts_repository_1.default);
exports.container.bind(blogs_repository_1.BlogsRepository).to(blogs_repository_1.BlogsRepository);
exports.container.bind(security_devices_repository_1.SecurityDevicesRepository).to(security_devices_repository_1.SecurityDevicesRepository);
exports.container.bind(auth_repository_1.AuthRepository).to(auth_repository_1.AuthRepository);
exports.container.bind(comments_repository_1.CommentsRepository).to(comments_repository_1.CommentsRepository);
// QueryRepositories
exports.container
    .bind(security_devices_query_repository_1.SecurityDevicesQueryRepository)
    .to(security_devices_query_repository_1.SecurityDevicesQueryRepository);
exports.container.bind(users_query_repository_1.UsersQueryRepository).to(users_query_repository_1.UsersQueryRepository);
//# sourceMappingURL=composition.root.js.map