import express from "express";
import {setupApp} from "../src/setup-app";
import {generateAdminAuthToken} from "../src/core/utils/generate-admin-auth-token";
import {runDB, stopDb} from "../src/core/db/mongo.db";
import {clearDb} from "./utils/clearDb";
import request from "supertest";
import httpStatusCode from "../src/core/types/HttpStatusCode";

describe('/users', () => {
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

    it('POST /users  CREATED_201', async () => {
        const newUser = {
            login: 'testwlogin',
            email: 'q@ed.com',
            password: 'pasqswrd123'
        };

        const postRresponse = await request(app)
            .post('/users')
            .set("Authorization", adminCredentials)
            .send(newUser)
            .expect(httpStatusCode.CREATED_201)

        expect(postRresponse.body).toHaveProperty('id');
        expect(postRresponse.body.login).toBe(newUser.login);
        expect(postRresponse.body.email).toBe(newUser.email);
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
        const newUser = {
            login: 'testlogin',
            email: 'q@e.com',
            password: 'passwrd123'
        };

        await request(app)
            .post('/users')
            .set("Authorization", adminCredentials)
            .send(newUser)
            .expect(httpStatusCode.CREATED_201);

        const getResponse = await request(app)
            .get('/users/')
            .set("Authorization", adminCredentials)
            .expect(200);

        const id = await getResponse.body.items[0].id;

        await request(app)
            .delete(`/users/${id}`)
            .set("Authorization", adminCredentials)
            .expect(204);
    });
})