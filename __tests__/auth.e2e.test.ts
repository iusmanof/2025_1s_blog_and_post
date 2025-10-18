import {describe} from "node:test";
import express from "express";
import {setupApp} from "../src/setup-app";
import {generateAdminAuthToken} from "../src/core/utils/generate-admin-auth-token";
import {getUserCollection, runDB, stopDb} from "../src/core/db/mongo.db";
import {SETTINGS} from "../src/core/settings/settings";
import {clearDb} from "./utils/clearDb";
import request from "supertest";
import httpStatusCode from "../src/core/types/HttpStatusCode";

describe("/auth", () => {
    const app = express();
    setupApp(app);
    const adminCredentials = generateAdminAuthToken()

    beforeAll(async () => {
        await runDB(SETTINGS.MONGODB_URI_TEST_DBNAME);
        await clearDb(app);
    })
    afterAll(async () => {
        await stopDb()
    })

    it('auth/login', async () => {
        console.log('Users before test:', await getUserCollection().find({}).toArray());
        const newUser = {
            login: "efwef",
            password: "dfwef32",
            email: "tes5@f.com"
        }
        await request(app)
            .post('/users')
            .set("Authorization", adminCredentials)
            .send(newUser)
            .expect(httpStatusCode.CREATED_201);

        const postResponse = await request(app)
            .post('/auth/login')
            .send({ loginOrEmail: newUser.login, password: newUser.password })
            .expect(httpStatusCode.OK_200);

        expect(postResponse.body).toHaveProperty("accessToken");

    })
})