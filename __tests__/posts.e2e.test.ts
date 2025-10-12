import express from "express";
import {setupApp} from "../src/setup-app";
import {generateAdminAuthToken} from "../src/auth/utils/generate-admin-auth-token";
import {runDB, stopDb} from "../src/core/db/mongo.db";
import {clearDb} from "./utils/clearDb";
import request from "supertest";
import httpStatusCode from "../src/core/types/HttpStatusCode";
import {createBlog} from "./utils/create-blog";
import {createPost, createPostWithBlogId} from "./utils/create-post";

describe('/posts', () => {
    const app = express();
    setupApp(app);
    const adminCredentials = generateAdminAuthToken()

    beforeAll(async () => {
        await runDB('mongodb://localhost:27017/test-DB');
        await clearDb(app);
    })

    afterAll(async () => {
        await stopDb()
    })

    it('GET /posts', async () =>{
        const blogId = await createBlog(app, adminCredentials);
        await createPostWithBlogId(app, adminCredentials, blogId);

        const getResponse = await request(app)
            .get("/posts")
            .expect(httpStatusCode.OK_200)

        expect(Array.isArray(getResponse.body.items)).toBe(true)
        expect(getResponse.body.items[0]).toHaveProperty('title');
        expect(getResponse.body).toHaveProperty('page')
        expect(getResponse.body).toHaveProperty('pageSize')
        expect(getResponse.body).toHaveProperty('totalCount')
        expect(getResponse.body).toHaveProperty('page')
        expect(getResponse.body).toHaveProperty('pageSize')
    })

    it("GET /posts/:id", async () =>{
        const postId = await  createPost(app, adminCredentials);

        const getResponse = await request(app)
            .get(`/posts/${postId}`)
            .expect(httpStatusCode.OK_200)

        expect(getResponse.body).toHaveProperty('id', postId);
    })

    it("POST /posts", async () => {
        const blogId = await createBlog(app, adminCredentials);
        await createPostWithBlogId(app, adminCredentials, blogId);
    })

    it("PUT /posts", async () => {
        const postId = await createPost(app, adminCredentials);

        const updatePost = {
            "id": postId,
            "title": "Title Post UPDATED",
            "content": "valid UPDATED",
            "shortDescription": "shor desc ",
        }

        await request(app)
            .put(`/posts/${postId}`)
            .set("Authorization", adminCredentials)
            .send(updatePost)
            .expect(httpStatusCode.NO_CONTENT_204)
    })

    it("DELETE /posts/:id", async () => {
        const postId = await createPost(app, adminCredentials);

        await request(app)
            .delete(`/posts/${postId}`)
            .set("Authorization", adminCredentials)
            .expect(httpStatusCode.NO_CONTENT_204)
    })

})