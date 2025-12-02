import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { IDevice } from "../types/device";

export type DeviceHyDrateDocument = HydratedDocument<IDevice>;

type DeviceModel = Model<IDevice>;

export const deviceSchema = new mongoose.Schema<IDevice>({
  title: { type: String, required: true },
  // TODO date ?
  lastActivateDate: { type: Number, required: true },
  deviceId: { type: String, required: true },
  userId: { type: String, required: true },
  // TODO date ?
  expiryDate: { type: Number, required: true },
  ip: { type: String, required: true },
});

export const DeviceMongooseModel = model<IDevice, DeviceModel>(
  "deivce",
  deviceSchema,
);
