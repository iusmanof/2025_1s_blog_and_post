import express, { Express } from "express";
import request from "supertest";
import { SETUP_APP } from "../src/setup-app";
import { generateAdminAuthToken } from "../src/core/utils/generate-admin-auth-token";
import { runDB, stopDb } from "../src/core/db/mongo.db";
import { UserMongooseModel } from "../src/users/models/user.model";
import httpStatusCode from "../src/core/types/http-status-code";
import { SETTINGS } from "../src/core/db/settings";

jest.mock("uuid", () => ({
  v4: () => "123456789",
}));

interface NewUserDto {
  login: string;
  email: string;
  password: string;
}

describe("/users", () => {
  let app: Express;
  let adminCredentials: string;
  let createdUserId: string;

  beforeAll(async () => {
    app = express();
    SETUP_APP(app);
    adminCredentials = generateAdminAuthToken();

    await runDB(SETTINGS.MONGODB_URI_TEST_DBNAME);

    await UserMongooseModel.deleteMany({});

    const newUser: NewUserDto = {
      login: "testlogin",
      email: "t@es.tom",
      password: "pass123",
    };

    const response = await request(app)
      .post("/users")
      .set("Authorization", adminCredentials)
      .send(newUser)
      .expect(httpStatusCode.CREATED_201);

    createdUserId = response.body.id;
  });

  afterAll(async () => {
    await UserMongooseModel.deleteMany({});
    await stopDb();
  });

  it("GET /users — should return paginated users", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", adminCredentials)
      .expect(httpStatusCode.OK_200);

    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("pageSize");
    expect(res.body).toHaveProperty("totalCount");
    expect(res.body).toHaveProperty("pagesCount");
  });

  it("POST /users — should return 400 for invalid input", async () => {
    const invalidUser: NewUserDto = {
      login: "testlogin",
      email: "testlogin@google.com",
      password: "",
    };

    await request(app)
      .post("/users")
      .set("Authorization", adminCredentials)
      .send(invalidUser)
      .expect(httpStatusCode.BAD_REQUEST_400);
  });

  it("DELETE /users — should delete the user", async () => {
    await request(app)
      .delete(`/users/${createdUserId}`)
      .set("Authorization", adminCredentials)
      .expect(httpStatusCode.NO_CONTENT_204);

    const deletedUser = await UserMongooseModel.findById(createdUserId);
    expect(deletedUser).toBeNull();
  });
});
