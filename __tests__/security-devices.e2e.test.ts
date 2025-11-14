import {usersService} from "../src/users/services/users.service";
import request from "supertest";
import express from "express";
import {SETUP_APP} from "../src/setup-app";
import {runDB, stopDb} from "../src/core/db/mongo.db";
import {clearDb} from "./utils/clearDb";
import {securityDevicesQueryRepository} from "../src/auth/repository/security-devices.query-repository";
import cookieParser from "cookie-parser";

jest.mock("uuid", () => ({
    v4: () => "123456789",
}));

describe("authService.login with multiple user-agents", () => {
    const app = express();
    app.use(cookieParser());
    app.use(express.json());
    SETUP_APP(app);
    let userId: string;

    beforeAll(async () => {
        await runDB("mongodb://localhost:27017/testDB");
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        await clearDb(app);

        userId = await usersService.create({
            login: "testLogin",
            password: "password",
            email: "test@el.com",
        });
    });

    afterAll(async () => {
        await stopDb();
    });

    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X)",
        "PostmanRuntime/7.29.2",
        "curl/7.79.1",
    ];

    it("should login 4 times with different user-agents", async () => {
        for (const userAgent of userAgents) {
            const res = await request(app)
                .post("/auth/login")
                .set("User-Agent", userAgent)
                .set("Accept", "application/json")
                .set("x-forwarded-for", "1.1.1.1")
                .send({ loginOrEmail: "testLogin", password: "password" })
                .expect(200);

            expect(res.body).toHaveProperty("accessToken");
        }

        const secDevices = await securityDevicesQueryRepository.findAll();
        expect(secDevices).toHaveLength(4)
    });

    it("should return 401 if no refresh token is provided", async () => {
        const res = await request(app).get("/security/devices/");
        expect(res.status).toBe(401);
        expect(res.body.errorsMessages).toBe("No refresh token provided");
    });

    it("should return 401 if no refreshToken provided", async () => {
        const res = await request(app).get("/security/devices");

        expect(res.status).toBe(401);
    });

    it("should return 401 if no refresh token is provided", async () => {
        await request(app)
            .get("/security/devices")
            .expect(401)
            .expect(res => {
                expect(res.body.errorsMessages).toBe("No refresh token provided");
            });
    });

    it("Обновляем refreshToken девайса 1", async () => {
        const user = await usersService.create({
            login: "deviceUser",
            password: "DevicePass123",
            email: "deviceUser@example.com",
        });

        const loginRes = await request(app)
            .post("/auth/login")
            .set("User-Agent", "Device-1-Agent")
            .set("x-forwarded-for", "1.1.1.1")
            .send({ loginOrEmail: "deviceUser", password: "DevicePass123" })
            .expect(200);


        const refreshTokenCookie = loginRes.headers['set-cookie']?.[0] || "";
        expect(refreshTokenCookie).toContain("refreshToken=");
        expect(refreshTokenCookie).toBeDefined();

        let devices = await securityDevicesQueryRepository.findAll();
        expect(devices).toHaveLength(1);
        expect(devices[0].userId.toString()).toBe(user);

        const refreshRes = await request(app)
            .post("/auth/refresh-token")
            .set("Cookie", refreshTokenCookie)
            .expect(200);

        expect(refreshRes.body).toHaveProperty("accessToken");
        const newRefreshTokenCookie = refreshRes.headers['set-cookie']?.[0];
        expect(newRefreshTokenCookie).toBeDefined();
        expect(newRefreshTokenCookie).toContain("refreshToken=");
        expect(newRefreshTokenCookie).toBeDefined();

        devices = await securityDevicesQueryRepository.findAll();
        expect(devices).toHaveLength(1);
        expect(devices[0].userId.toString()).toBe(user);

    });

});
