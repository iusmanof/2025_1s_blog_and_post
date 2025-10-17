import request from "supertest";
import dotenv from "dotenv";
import httpStatusCode from "../src/core/types/HttpStatusCode";
import express from "express";
import {setupApp} from "../src/setup-app";
import {generateAdminAuthToken} from "../src/core/utils/generate-admin-auth-token";
import {runDB, stopDb} from "../src/core/db/mongo.db";
import {clearDb} from "./utils/clearDb";
import HttpStatusCode from "../src/core/types/HttpStatusCode"; // Этот импорт нужно перенести сюда

dotenv.config();

describe("/blogs", () => {
    const app = express();
    setupApp(app);
    const adminCredentials = generateAdminAuthToken()

    beforeAll(async () => {
        await runDB('mongodb://localhost:27017/test=DB');
        await clearDb(app);
    });

    afterAll(async () => {
        await stopDb();
    });

    it("POST /blogs UNAUTHORIZED", async () => {
        await request(app)
            .post("/blogs")
            .send({name: " ", description: ""})
            .expect(httpStatusCode.UNAUTHORIZED_401);
    });

    it("POST /blogs coorect data", async () => {
        const newBlog = {
            name: "My Blog",
            description: "A blog about tech and coding",
            websiteUrl: "https://mytechblog.com"
        };

        await request(app)
            .post("/blogs")
            .set("Authorization", adminCredentials)
            .send(newBlog)
            .expect(httpStatusCode.CREATED_201);
    })


    it("POST /blogs", async () => {
        await request(app)
            .post("/blogs")
            .set("Authorization", adminCredentials)
            .send({name: " ", description: ""})
            .expect(httpStatusCode.BAD_REQUEST_400, {
                errorsMessages: [
                    {message: "Name max length 15", field: "name"},
                    {message: "URL must be a valid URL", field: "websiteUrl"},
                ],
            });

        const res = await request(app).get("/blogs");
        expect(res.statusCode).toBe(httpStatusCode.OK_200);
    });

    it("GET /blogs/id incorrect id", async () => {
        await request(app)
            .get("/blogs/incorrectid")
            .expect(HttpStatusCode.BAD_REQUEST_400);
    });

    it("GET /blogs/id correct id hex", async () => {
        await request(app)
            .post("/blogs")
            .set("Authorization", adminCredentials)
            .send({
                name: "name",
                websiteUrl: "https://websiteUrl.domd",
                description: "description",
            });

        await request(app)
            .get("/blogs/123456789123456789123456")
            .expect(HttpStatusCode.NOT_FOUND_404);
    });

    it("PUT /blogs/id incorrect data", async () => {
        const createdBlog = await request(app)
            .post("/blogs")
            .set("Authorization", adminCredentials)
            .send({
                name: "name",
                websiteUrl: "https://websiteUrl.domd",
                description: "description",
            });

        const blogId = createdBlog.body.id;

        await request(app)
            .put(`/blogs/${blogId}`) // Исправил на правильный путь с использованием слэша
            .set("Authorization", adminCredentials)
            .send({name: "name", websiteUrl: "BAD URL", description: "description"})
            .expect(HttpStatusCode.BAD_REQUEST_400);
    });

    it("PUT /blogs/id correct data", async () => {
        const createdBlog = await request(app)
            .post("/blogs")
            .set("Authorization", adminCredentials)
            .send({
                name: "name",
                websiteUrl: "https://websiteUrl.domd",
                description: "description",
            });

        const blogId = createdBlog.body.id;

        await request(app)
            .put(`/blogs/${blogId}`)
            .set("Authorization", adminCredentials)
            .send({
                name: "name",
                websiteUrl: "http://correct.url",
                description: "description",
            })
            .expect(HttpStatusCode.NO_CONTENT_204);
    });

    it("DELETE /blogs/id incorrect id", async () => {
        await request(app)
            .delete("/blogs/INCORECT_ID")
            .set("Authorization", adminCredentials)
            .expect(HttpStatusCode.NOT_FOUND_404);
    });

    it("DELETE /blogs/id correct data", async () => {
        const createdBlog = await request(app)
            .post("/blogs")
            .set("Authorization", adminCredentials)
            .send({
                name: "name",
                websiteUrl: "https://websiteUrl.domd",
                description: "description",
            });

        const blogId = createdBlog.body.id;

        await request(app)
            .delete(`/blogs/${blogId}`)
            .set("Authorization", adminCredentials)
            .expect(HttpStatusCode.NO_CONTENT_204);
    });
});
