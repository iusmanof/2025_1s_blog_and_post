import "reflect-metadata";
import {Container} from "inversify";

import { UsersRepository } from "./users/repositories/users.repository";
import { BcryptAdapter } from "./auth/adapters/bcrypt.adapter";
import { UsersService } from "./users/services/users.service";
import { EmailAdapter } from "./auth/adapters/email.adapter";
import { JwtAdapter } from "./auth/adapters/jwt.adapter";
import { AuthRepository } from "./auth/repositories/auth.repository";
import { SecurityDevicesQueryRepository } from "./auth/repositories/security-devices.query-repository";
import { SecurityDevicesRepository } from "./auth/repositories/security-devices.repository";
import { AuthService } from "./auth/services/auth.service";
import { SecurityDevicesService } from "./auth/services/security-devices.service";
import { BlogsArrayRepository } from "./blogs/repositories/blogs.array.repository";
import { BlogsRepository } from "./blogs/repositories/blogs.repository";
import { BlogService } from "./blogs/services/blog.service";
import { CommentsService } from "./comments/services/comments.service";
import { CommentsRepository } from "./comments/repositories/comments.repository";
import { PostAccessLayer } from "./posts/repositories/posts.array.repository";
import { PostsRepository } from "./posts/repositories/posts.repository";
import { PostService } from "./posts/services/post.service";
import { UsersQueryRepository } from "./users/repositories/users.query.repository";

// auth & security-devices
export const bcryptAdapter = new BcryptAdapter();
export const emailAdapter = new EmailAdapter();
export const jwtAdapter = new JwtAdapter();

export const authRepository = new AuthRepository();
export const securityDevicesQueryRepository =
  new SecurityDevicesQueryRepository();
export const securityDevicesRepository = new SecurityDevicesRepository();

// blogs
export const blogsArrayRepository = new BlogsArrayRepository();

// comments
export const commentsRepository = new CommentsRepository();
export const commentsService = new CommentsService();

// posts

// users
export const usersQueryRepository = new UsersQueryRepository();
export const usersRepository = new UsersRepository();

// export const usersService = new UsersService(usersRepository, bcryptAdapter);
export const securityDevicesService = new SecurityDevicesService(
  jwtAdapter,
  securityDevicesRepository,
  securityDevicesQueryRepository,
);
export const authService = new AuthService(
  jwtAdapter,
  emailAdapter,
  bcryptAdapter,
  securityDevicesService,
  securityDevicesQueryRepository,
  securityDevicesRepository,
  usersQueryRepository,
  usersRepository,
);
export const postsRepository = new PostsRepository();
export const blogsRepository = new BlogsRepository();
export const blogService = new BlogService(blogsRepository);
export const postAccessLayer = new PostAccessLayer(blogsArrayRepository);
export const postService = new PostService(postsRepository);

//
export const container = new Container();
container.bind(BcryptAdapter).to(BcryptAdapter)
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersService).to(UsersService)
// container.bind(EmailAdapter).to(EmailAdapter)
// container.bind(JwtAdapter).to(JwtAdapter)
// container.bind(AuthRepository).to(AuthRepository)
// container.bind(BlogsArrayRepository).to(BlogsArrayRepository)
// container.bind(CommentsRepository).to(CommentsRepository)
// container.bind(CommentsService).to(CommentsService)
// container.bind(UsersQueryRepository).to(UsersQueryRepository)

// container.bind(AuthService).to(AuthService)
// container.bind(PostsRepository).to(PostsRepository)
// container.bind(BlogsRepository).to(BlogsRepository)
// container.bind(BlogService).to(BlogService)
// container.bind(PostAccessLayer).to(PostAccessLayer)
// container.bind(PostService).to(PostService)

