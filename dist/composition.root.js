"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postService = exports.postAccessLayer = exports.blogService = exports.blogsRepository = exports.postsRepository = exports.authService = exports.securityDevicesService = exports.usersService = exports.usersRepository = exports.usersQueryRepository = exports.commentsService = exports.commentsRepository = exports.blogsArrayRepository = exports.securityDevicesRepository = exports.securityDevicesQueryRepository = exports.authRepository = exports.jwtAdapter = exports.emailAdapter = exports.bcryptAdapter = void 0;
require("reflect-metadata");
// import {Container} from "inversify";
const users_repository_1 = require("./users/repositories/users.repository");
const bcrypt_adapter_1 = require("./auth/adapters/bcrypt.adapter");
const users_service_1 = require("./users/services/users.service");
const email_adapter_1 = require("./auth/adapters/email.adapter");
const jwt_adapter_1 = require("./auth/adapters/jwt.adapter");
const auth_repository_1 = require("./auth/repositories/auth.repository");
const security_devices_query_repository_1 = require("./auth/repositories/security-devices.query-repository");
const security_devices_repository_1 = require("./auth/repositories/security-devices.repository");
const auth_service_1 = require("./auth/services/auth.service");
const security_devices_service_1 = require("./auth/services/security-devices.service");
const blogs_array_repository_1 = require("./blogs/repositories/blogs.array.repository");
const blogs_repository_1 = require("./blogs/repositories/blogs.repository");
const blog_service_1 = require("./blogs/services/blog.service");
const comments_service_1 = require("./comments/services/comments.service");
const comments_repository_1 = require("./comments/repositories/comments.repository");
const posts_array_repository_1 = require("./posts/repositories/posts.array.repository");
const posts_repository_1 = require("./posts/repositories/posts.repository");
const post_service_1 = require("./posts/services/post.service");
const users_query_repository_1 = require("./users/repositories/users.query.repository");
// auth & security-devices
exports.bcryptAdapter = new bcrypt_adapter_1.BcryptAdapter();
exports.emailAdapter = new email_adapter_1.EmailAdapter();
exports.jwtAdapter = new jwt_adapter_1.JwtAdapter();
exports.authRepository = new auth_repository_1.AuthRepository();
exports.securityDevicesQueryRepository = new security_devices_query_repository_1.SecurityDevicesQueryRepository();
exports.securityDevicesRepository = new security_devices_repository_1.SecurityDevicesRepository();
// blogs
exports.blogsArrayRepository = new blogs_array_repository_1.BlogsArrayRepository();
// comments
exports.commentsRepository = new comments_repository_1.CommentsRepository();
exports.commentsService = new comments_service_1.CommentsService();
// posts
// users
exports.usersQueryRepository = new users_query_repository_1.UsersQueryRepository();
exports.usersRepository = new users_repository_1.UsersRepository();
exports.usersService = new users_service_1.UsersService(exports.usersRepository, exports.bcryptAdapter);
exports.securityDevicesService = new security_devices_service_1.SecurityDevicesService(exports.jwtAdapter, exports.securityDevicesRepository, exports.securityDevicesQueryRepository);
exports.authService = new auth_service_1.AuthService(exports.jwtAdapter, exports.emailAdapter, exports.bcryptAdapter, exports.securityDevicesService, exports.securityDevicesQueryRepository, exports.securityDevicesRepository, exports.usersQueryRepository, exports.usersRepository);
exports.postsRepository = new posts_repository_1.PostsRepository();
exports.blogsRepository = new blogs_repository_1.BlogsRepository();
exports.blogService = new blog_service_1.BlogService(exports.blogsRepository);
exports.postAccessLayer = new posts_array_repository_1.PostAccessLayer(exports.blogsArrayRepository);
exports.postService = new post_service_1.PostService(exports.postsRepository);
//
// export const container = new Container();
// container.bind(BcryptAdapter).to(BcryptAdapter)
// container.bind(EmailAdapter).to(EmailAdapter)
// container.bind(JwtAdapter).to(JwtAdapter)
// container.bind(AuthRepository).to(AuthRepository)
// container.bind(BlogsArrayRepository).to(BlogsArrayRepository)
// container.bind(CommentsRepository).to(CommentsRepository)
// container.bind(CommentsService).to(CommentsService)
// container.bind(UsersQueryRepository).to(UsersQueryRepository)
// container.bind(UsersRepository).to(UsersRepository)
// container.bind(UsersService).to(UsersService)
// container.bind(AuthService).to(AuthService)
// container.bind(PostsRepository).to(PostsRepository)
// container.bind(BlogsRepository).to(BlogsRepository)
// container.bind(BlogService).to(BlogService)
// container.bind(PostAccessLayer).to(PostAccessLayer)
// container.bind(PostService).to(PostService)
//
//# sourceMappingURL=composition.root.js.map