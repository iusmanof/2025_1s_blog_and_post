import {Express} from "express";
import request from "supertest";
import httpStatusCode from "../../src/core/types/HttpStatusCode";

export async function createPost(app: Express, adminCredentials: string): Promise<string> {
    const newPost = {
        "title": "Title Post Test",
        "content": "content test",
        "shortDescription": "shortDescription test",
    }

    const postResponse = await request(app)
        .post("/posts")
        .set("Authorization", adminCredentials)
        .send(newPost)
        .expect(httpStatusCode.CREATED_201)

    return await postResponse.body.id
}

export async function createPostWithBlogId(app: Express, adminCredentials: string, blogId: string): Promise<string> {
    const newPost = {
        "title": "Title Post Test",
        "content": "content test",
        "shortDescription": "shortDescription test",
        "blogId": blogId
    }

    const postResponse = await request(app)
        .post("/posts")
        .set("Authorization", adminCredentials)
        .send(newPost)
        .expect(httpStatusCode.CREATED_201)

    return await postResponse.body.id
}