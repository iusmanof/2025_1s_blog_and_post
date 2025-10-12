import {Request, Response, Router} from "express";
import {blogsRepository} from "../../blogs/repositories/blogs.repository";
import {postsRepository} from "../../posts/repositories/posts.repository";

export const testingRouter = Router();

testingRouter.delete('/', async (req: Request, res: Response) => {
    await blogsRepository.deleteAllBlogs();
    await postsRepository.deleteAllPosts();
    res.status(204).send("All data is deleted");
});

