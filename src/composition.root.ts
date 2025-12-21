import "reflect-metadata";
import { Container } from "inversify";
import { UsersRepository } from "./users/infrastructure/users.repository";
import { BcryptAdapter } from "./auth/adapters/bcrypt.adapter";
import { UsersService } from "./users/application/users.service";
import {
  EmailAdapter,
  EmailAdapterRecoveryPassword,
  EmailAdapterYandex,
} from "./auth/adapters/email.adapter";
import { JwtAdapter } from "./auth/adapters/jwt.adapter";
import { AuthRepository } from "./auth/repositories/auth.repository";
import { SecurityDevicesQueryRepository } from "./auth/repositories/security-devices.query-repository";
import { SecurityDevicesRepository } from "./auth/repositories/security-devices.repository";
import { AuthService } from "./auth/services/auth.service";
import { SecurityDevicesService } from "./auth/services/security-devices.service";
import { BlogsRepository } from "./blogs/infrastructure/blogs.repository";
import { BlogService } from "./blogs/application/blog.service";
import CommentsService from "./comments/services/comments.service";
import { CommentsRepository } from "./comments/repositories/comments.repository";
import PostsRepository from "./posts/infrastructure/posts.repository";
import { PostService } from "./posts/application/post.service";
import { UsersQueryRepository } from "./users/infrastructure/users.query.repository";
import { BlogController } from "./blogs/presentation/blog.controller";
import { CommentController } from "./comments/controllers/comment.controller";
import { PostController } from "./posts/presentation/post.controller";
import { UserController } from "./users/presentation/user.controller";
import { AuthController } from "./auth/controllers/auth.controller";
import { SecurityDeviceController } from "./auth/controllers/security-devices.controller";

export const container = new Container();

// Adapters
container.bind(BcryptAdapter).to(BcryptAdapter);
container.bind(JwtAdapter).to(JwtAdapter);
container.bind(EmailAdapter).to(EmailAdapter);
container.bind(EmailAdapterRecoveryPassword).to(EmailAdapterRecoveryPassword);
container.bind(EmailAdapterYandex).to(EmailAdapterYandex);

// Controllers
container.bind(BlogController).to(BlogController);
container.bind(CommentController).to(CommentController);
container.bind(PostController).to(PostController);
container.bind(UserController).to(UserController);
container.bind(AuthController).to(AuthController);
container.bind(SecurityDeviceController).to(SecurityDeviceController);

// Services
container.bind(UsersService).to(UsersService);
container.bind(PostService).to(PostService);
container.bind(BlogService).to(BlogService);
container.bind(SecurityDevicesService).to(SecurityDevicesService);
container.bind(AuthService).to(AuthService);
container.bind(CommentsService).to(CommentsService);

// Repositories
container.bind(UsersRepository).to(UsersRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository);
container.bind(AuthRepository).to(AuthRepository);
container.bind(CommentsRepository).to(CommentsRepository);

// QueryRepositories
container
  .bind(SecurityDevicesQueryRepository)
  .to(SecurityDevicesQueryRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
