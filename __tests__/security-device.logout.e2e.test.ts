import request from "supertest";
import express from "express";
import { SETUP_APP } from "../src/setup-app";
import { runDB, stopDb } from "../src/core/db/mongo.db";
import { clearDb } from "./utils/clearDb";
import cookieParser from "cookie-parser";

import { UsersService } from "../src/users/application/users.service";
import { container } from "../src/composition.root";
const usersService = container.get(UsersService);

jest.mock("uuid", () => ({ v4: () => "123456789" }));

describe("E2E: Logout device 3 and check devices list from device 1", () => {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  SETUP_APP(app);

  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X)",
    "PostmanRuntime/7.29.2",
  ];

  let refreshTokens: string[] = [];
  let userId: string;

  beforeAll(async () => {
    await runDB("mongodb://localhost:27017/testDB");
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await clearDb(app);
    refreshTokens = [];

    userId = await usersService.create({
      login: "testLogin",
      password: "password",
      email: "test@el.com",
    });
  });

  afterAll(async () => {
    await stopDb();
  });

  it("should logout device 3 and device 3 disappear from devices list", async () => {
    for (const ua of userAgents) {
      const loginRes = await request(app)
        .post("/auth/login")
        .set("User-Agent", ua)
        .send({ loginOrEmail: "testLogin", password: "password" })
        .expect(200);

      const refreshTokenCookie = loginRes.headers["set-cookie"]?.[0];
      const token = refreshTokenCookie?.split("refreshToken=")[1].split(";")[0];
      refreshTokens.push(token!);
    }

    await request(app)
      .post("/auth/logout")
      .set("Cookie", `refreshToken=${refreshTokens[2]}`)
      .expect(204);

    const devicesRes = await request(app)
      .get("/security/devices")
      .set("Cookie", `refreshToken=${refreshTokens[0]}`)
      .expect(200);

    const devices = devicesRes.body;

    expect(devices.some((d: any) => d.deviceId === "123456789")).toBe(true);
  });
});
