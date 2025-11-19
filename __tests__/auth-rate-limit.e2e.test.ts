import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import { SETUP_APP } from "../src/setup-app";

jest.mock("uuid", () => ({ v4: () => "123456789" }));

describe("RATE LIMIT /login", () => {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  SETUP_APP(app);

  const correctBody = {
    loginOrEmail: "test@test.com",
    password: "123456",
  };

  it("should block after 5 requests", async () => {
    for (let i = 1; i <= 5; i++) {
      const res = await request(app)
        .post("/auth/login")
        .set("User-Agent", "jest-test")
        .send(correctBody);

      expect(res.status).not.toBe(429);
    }

    const sixth = await request(app)
      .post("/auth/login")
      .set("User-Agent", "jest-test")
      .send(correctBody);

    expect(sixth.status).toBe(429);
  });
});
