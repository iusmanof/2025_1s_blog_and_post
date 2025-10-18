import express from "express";
import {setupApp} from "../src/setup-app";
import {generateAdminAuthToken} from "../src/core/utils/generate-admin-auth-token";
import {runDB, stopDb} from "../src/core/db/mongo.db";
import {clearDb} from "./utils/clearDb";
import request from "supertest";
import httpStatusCode from "../src/core/types/HttpStatusCode";
import {SETTINGS} from "../src/core/settings/settings";

describe('/users', () => {
    const app = express();
    setupApp(app);
    const adminCredentials = generateAdminAuthToken()
    let createdUserId: string;

    beforeAll(async () => {
        await runDB(SETTINGS.MONGODB_URI_TEST_DBNAME);
        await clearDb(app);

        const newUser = {
            login: 'testlogin',
            email: 't@es.tom',
            password: 'pass123'
        };
        const response = await request(app)
            .post('/users')
            .set("Authorization", adminCredentials)
            .send(newUser)
            .expect(httpStatusCode.CREATED_201);

        createdUserId = response.body.id;
    })

    afterAll(async () => {
        await stopDb()
    })

    it('GET /users', async () => {
        const getResponse = await request(app)
            .get("/users")
            .set("Authorization", adminCredentials)
            .expect(httpStatusCode.OK_200)

        expect(Array.isArray(getResponse.body.items)).toBe(true)
        expect(getResponse.body).toHaveProperty('pageSize')
        expect(getResponse.body).toHaveProperty('totalCount')
        expect(getResponse.body).toHaveProperty('page')
        expect(getResponse.body).toHaveProperty('pageSize')
    })

    it('POST /users BAD_REQUEST_400', async () => {
        const newUser = {
            login: 'testlogin',
            email: 'testlogin@google.com',
            password: ''
        };

        await request(app)
            .post('/users')
            .set("Authorization", adminCredentials)
            .send(newUser)
            .expect(httpStatusCode.BAD_REQUEST_400)
    })
    it('DELETE /users', async () => {

        await request(app)
            .delete(`/users/${createdUserId}`)
            .set("Authorization", adminCredentials)
            .expect(204);
    });
})