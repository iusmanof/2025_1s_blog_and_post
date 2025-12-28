import mongoose, { Model } from "mongoose";
import { IDevice } from "../types/device";
import {
  SecurityDeviceDbDto,
  UPDATEsecurityDeviceDbDto,
} from "../types/security-device-db.dto";

export interface DeviceModel extends Model<IDevice> {
  findAll(): Promise<IDevice[]>;
  geByDeviceId(deviceId: string): Promise<IDevice | null>;
  findByIdAndIat(deviceId: string, iat: number): Promise<IDevice | null>;
  findAllDevicesByUserId(userId: string): Promise<IDevice[]>;
  addDevice(dto: SecurityDeviceDbDto): Promise<void>;
  updateDevice(
    deviceId: string,
    updatedDbDto: UPDATEsecurityDeviceDbDto,
  ): Promise<void>;
  deleteDevice(deviceId: string): Promise<{ count: number }>;
  deleteAllDevices(): Promise<void>;
  deleteAllDevicesExcludeCurrent(deviceId: string): Promise<void>;
}

export const deviceSchema = new mongoose.Schema<IDevice>({
  title: { type: String, required: true },
  lastActivateDate: { type: Date, required: true },
  deviceId: { type: String, required: true },
  userId: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  ip: { type: String, required: true },
});

deviceSchema.statics.findAll = function () {
  return this.find({}).exec();
};

deviceSchema.statics.geByDeviceId = function (deviceId: string) {
  return this.findOne({ deviceId }).exec();
};

deviceSchema.statics.findByIdAndIat = function (deviceId: string, iat: number) {
  return this.findOne({ deviceId, lastActivateDate: iat }).exec();
};

deviceSchema.statics.findAllDevicesByUserId = function (userId: string) {
  return this.find({ userId }).exec();
};

deviceSchema.statics.addDevice = async function (dto: SecurityDeviceDbDto) {
  await this.create(dto);
};

deviceSchema.statics.updateDevice = async function (
  deviceId: string,
  updatedDbDto: UPDATEsecurityDeviceDbDto,
) {
  await this.updateOne({ deviceId }, { $set: updatedDbDto }).exec();
};

deviceSchema.statics.deleteDevice = async function (
  deviceId: string,
): Promise<{ count: number }> {
  const res = await this.deleteOne({ deviceId }).exec();
  return { count: res.deletedCount ?? 0 };
};

deviceSchema.statics.deleteAllDevices = async function () {
  await this.deleteMany({}).exec();
};

deviceSchema.statics.deleteAllDevicesExcludeCurrent = async function (
  deviceId: string,
) {
  await this.deleteMany({ deviceId: { $ne: deviceId } }).exec();
};

export const DeviceMongooseModel = mongoose.model<IDevice, DeviceModel>(
  "device",
  deviceSchema,
);
