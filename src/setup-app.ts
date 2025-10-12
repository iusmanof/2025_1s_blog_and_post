import express, {Express, Request, Response} from "express";
import {BLOGS_PATH, POSTS_PATH, TESTING_PATH} from "./core/paths/paths";
import {blogRouter} from "./blogs/routes/blog.route";
import {postRouter} from "./posts/routes/post.route";
import {testingRouter} from "./testing/routes/testing.route";

export const  setupApp = (app: Express) =>{
    app.use(express.json());

    app.use(BLOGS_PATH, blogRouter);
    app.use(POSTS_PATH, postRouter);
    app.use(TESTING_PATH, testingRouter);

    app.get("/", async (req: Request, res: Response) => {
        await res.send("blogs api");
    });

    return app
}