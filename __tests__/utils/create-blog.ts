import request from "supertest";
import httpStatusCode from "../../src/core/types/HttpStatusCode";
import {Express} from "express";

export async function createBlog(app: Express, adminCredentials: string): Promise<string> {
    const newBlog = {
        name: "New Blog Test",
        description: "test description",
        websiteUrl: "https://test.test"
    };
    const response = await request(app)
        .post("/blogs")
        .set("Authorization", adminCredentials)
        .send(newBlog)
        .expect(httpStatusCode.CREATED_201);

    return response.body.id;
}




