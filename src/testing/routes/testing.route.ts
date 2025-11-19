import { Request, Response, Router } from "express";
import {
  authRepository,
  blogsRepository,
  commentsRepository,
  postsRepository,
  securityDevicesRepository,
  usersRepository,
} from "../../composition.root";

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
