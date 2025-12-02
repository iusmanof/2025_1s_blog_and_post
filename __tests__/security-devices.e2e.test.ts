import express from "express";
import request from "supertest";
import { SETUP_APP } from "../src/setup-app";
import { generateAdminAuthToken } from "../src/core/utils/generate-admin-auth-token";
import { runDB, stopDb } from "../src/core/db/mongo.db";
import { clearDb } from "./utils/clearDb";
import httpStatusCode from "../src/core/types/http-status-code";
import { SETTINGS } from "../src/core/db/settings";
import { DeviceMongooseModel, IDevice } from "../src/auth/models/device.model"; // правильный путь
import { HydratedDocument } from "mongoose";

jest.mock("uuid", () => ({
  v4: () => "123456789",
}));

describe("/security-devices", () => {
  const app = express();
  SETUP_APP(app);
  const adminCredentials = generateAdminAuthToken();
  let createdUserId: string;

  beforeAll(async () => {
    await runDB(SETTINGS.MONGODB_URI_TEST_DBNAME);
    await clearDb(app);

    // создаем тестового пользователя через Mongoose
    const user = await DeviceMongooseModel.create({
      title: "Test Device",
      deviceId: "123456789",
      userId: "user123",
      lastActivateDate: Math.floor(Date.now() / 1000),
      expiryDate: Math.floor(Date.now() / 1000) + 3600,
    } as IDevice);

    createdUserId = user.userId;
  });

  afterAll(async () => {
    await stopDb();
  });

  it("GET /security-devices - should return all devices", async () => {
    const devices: HydratedDocument<IDevice>[] = await DeviceMongooseModel.find(
      {},
    ).exec();

    expect(devices).toHaveLength(1);
    expect(devices[0].userId.toString()).toBe(createdUserId);
    expect(devices[0].title).toBe("Test Device");
    expect(devices[0].deviceId).toBe("123456789");
  });

  it("POST /security-devices - should create a new device", async () => {
    const newDevice = {
      title: "New Device",
      deviceId: "987654321",
      userId: "user123",
      lastActivateDate: Math.floor(Date.now() / 1000),
      expiryDate: Math.floor(Date.now() / 1000) + 3600,
    };

    const response = await request(app)
      .post("/security-devices")
      .set("Authorization", adminCredentials)
      .send(newDevice)
      .expect(httpStatusCode.CREATED_201);

    expect(response.body.userId).toBe(newDevice.userId);
    expect(response.body.deviceId).toBe(newDevice.deviceId);
  });

  it("GET /security-devices/:deviceId - should return a single device", async () => {
    const device = await DeviceMongooseModel.findOne({
      deviceId: "123456789",
    }).exec();

    const response = await request(app)
      .get(`/security-devices/${device?.deviceId}`)
      .set("Authorization", adminCredentials)
      .expect(httpStatusCode.OK_200);

    expect(response.body.deviceId).toBe("123456789");
    expect(response.body.userId).toBe(createdUserId);
  });

  it("DELETE /security-devices/:deviceId - should delete a device", async () => {
    const device = await DeviceMongooseModel.findOne({
      deviceId: "123456789",
    }).exec();

    await request(app)
      .delete(`/security-devices/${device?.deviceId}`)
      .set("Authorization", adminCredentials)
      .expect(httpStatusCode.NO_CONTENT_204);

    const deleted = await DeviceMongooseModel.findOne({
      deviceId: "123456789",
    }).exec();
    expect(deleted).toBeNull();
  });
});
