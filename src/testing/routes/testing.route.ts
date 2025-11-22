import "reflect-metadata";
import { container } from "../../composition.root";
import { Request, Response, Router } from "express";
import { AuthRepository } from "../../auth/repositories/auth.repository";
import { BlogsRepository } from "../../blogs/repositories/blogs.repository";
import { CommentsRepository } from "../../comments/repositories/comments.repository";
import { PostsRepository } from "../../posts/repositories/posts.repository";
import { SecurityDevicesRepository } from "../../auth/repositories/security-devices.repository";
import { UsersRepository } from "../../users/repositories/users.repository";

const authRepository = container.get(AuthRepository);
const blogsRepository = container.get(BlogsRepository);
const commentsRepository = container.get(CommentsRepository);
const postsRepository = container.get(PostsRepository);
const securityDevicesRepository = container.get(SecurityDevicesRepository);
const usersRepository = container.get(UsersRepository);

export const testingRouter = Router();

testingRouter.delete("/", async (req: Request, res: Response) => {
  await blogsRepository.deleteAllBlogs();
  await postsRepository.deleteAllPosts();
  await usersRepository.deleteAllUsers();
  await commentsRepository.deleteAllComments();
  await authRepository.deleteRefreshTokenBlackList();
  await securityDevicesRepository.deleteAllDevices();
  res.status(204).send("All data is deleted");
});
