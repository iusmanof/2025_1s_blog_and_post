import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { IDevice } from "../types/device";

export type DeviceHyDrateDocument = HydratedDocument<IDevice>;

type DeviceModel = Model<IDevice>;

export const deviceSchema = new mongoose.Schema<IDevice>({
  title: { type: String, required: true },
  lastActivateDate: { type: Date, required: true },
  deviceId: { type: String, required: true },
  userId: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  ip: { type: String, required: true },
});

export const DeviceMongooseModel = model<IDevice, DeviceModel>(
  "device",
  deviceSchema,
);
