import { injectable } from "inversify";
import {
  SecurityDeviceDbDto,
  UPDATEsecurityDeviceDbDto,
} from "../types/security-device-db.dto";
import { DeviceMongooseModel } from "../domain/device.entity";

@injectable()
export class SecurityDevicesRepository {
  async findAllDevices() {
    return await DeviceMongooseModel.find().exec();
  }
  async findAllDevicesByUserId(userId: string) {
    return await DeviceMongooseModel.find({ userId }).exec();
  }
  async addDevice(dbDto: SecurityDeviceDbDto) {
    await DeviceMongooseModel.create(dbDto);
  }
  async updateDevice(
    deviceId: string,
    updatedDbDto: UPDATEsecurityDeviceDbDto,
  ) {
    await DeviceMongooseModel.updateOne(
      { deviceId: deviceId },
      { $set: updatedDbDto },
    ).exec();
  }
  async deleteDevice(deviceId: string): Promise<{ count: number }> {
    const result = await DeviceMongooseModel.deleteOne({ deviceId }).exec();
    return { count: result.deletedCount ?? 0 };
  }
  async deleteAllDevices() {
    return DeviceMongooseModel.deleteMany({}).exec();
  }
  async deleteAllDevicesExcludeCurrent(deviceId: string) {
    await DeviceMongooseModel.deleteMany({
      deviceId: { $ne: deviceId },
    }).exec();
  }
}
