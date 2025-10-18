import express, {Express, Request, Response} from "express";
import {AUTH_PATH, BLOGS_PATH, POSTS_PATH, TESTING_PATH, USERS_PATH, COMMENTS_PATH} from "./core/paths/paths";
import {blogRouter} from "./blogs/routes/blog.route";
import {postRouter} from "./posts/routes/post.route";
import {testingRouter} from "./testing/routes/testing.route";
import {userRouter} from "./users/routes/users.route";
import {authRouter} from "./auth/routes/auth.routes";
import {commentsRouter} from "./comments/routes/comments.route";

export const  setupApp = (app: Express) =>{
    app.use(express.json());

    app.use(BLOGS_PATH, blogRouter);
    app.use(POSTS_PATH, postRouter);
    app.use(USERS_PATH, userRouter);
    app.use(TESTING_PATH, testingRouter);
    app.use(AUTH_PATH, authRouter);
    app.use(COMMENTS_PATH, commentsRouter);

    app.get("/", async (req: Request, res: Response) => {
        await res.send("blogs api");
    });

    return app
}