import express, {Express, Request, Response} from "express";
import {BLOGS_PATH, POSTS_PATH, TESTING_PATH, USERS_PATH} from "./core/paths/paths";
import {blogRouter} from "./blogs/routes/blog.route";
import {postRouter} from "./posts/routes/post.route";
import {testingRouter} from "./testing/routes/testing.route";
import {userRouter} from "./users/routes/users.route";

export const  setupApp = (app: Express) =>{
    app.use(express.json());

    app.use(BLOGS_PATH, blogRouter);
    app.use(POSTS_PATH, postRouter);
    app.use(USERS_PATH, userRouter);
    app.use(TESTING_PATH, testingRouter);

    app.get("/", async (req: Request, res: Response) => {
        await res.send("blogs api");
    });

    return app
}