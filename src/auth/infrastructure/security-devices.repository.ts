import { injectable } from "inversify";
import {
  SecurityDeviceDbDto,
  UPDATEsecurityDeviceDbDto,
} from "../types/security-device-db.dto";
import { DeviceMongooseModel } from "./device.mongo";

@injectable()
export class SecurityDevicesRepository {
  async findAllDevices() {
    return DeviceMongooseModel.findAll();
  }

  async findAllDevicesByUserId(userId: string) {
    return DeviceMongooseModel.findAllDevicesByUserId(userId);
  }

  async addDevice(dbDto: SecurityDeviceDbDto) {
    await DeviceMongooseModel.addDevice(dbDto);
  }

  async updateDevice(
    deviceId: string,
    updatedDbDto: UPDATEsecurityDeviceDbDto,
  ) {
    await DeviceMongooseModel.updateDevice(deviceId, updatedDbDto);
  }

  async deleteDevice(deviceId: string): Promise<{ count: number }> {
    return DeviceMongooseModel.deleteDevice(deviceId);
  }

  async deleteAllDevices() {
    await DeviceMongooseModel.deleteAllDevices();
  }

  async deleteAllDevicesExcludeCurrent(deviceId: string) {
    await DeviceMongooseModel.deleteAllDevicesExcludeCurrent(deviceId);
  }
}
