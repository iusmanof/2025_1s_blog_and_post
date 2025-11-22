import { injectable } from "inversify";
import { getSecurityDeviceCollection } from "../../core/db/mongo.db";
import {
  SecurityDeviceDbDto,
  UPDATEsecurityDeviceDbDto,
} from "../types/security-device-db.dto";

@injectable()
export class SecurityDevicesRepository {
  async findAllDevices() {
    return await getSecurityDeviceCollection().find().toArray();
  }
  async findAllDevicesByUserId(userId: string) {
    return await getSecurityDeviceCollection().find({ userId }).toArray();
  }
  async addDevice(dbDto: SecurityDeviceDbDto) {
    await getSecurityDeviceCollection().insertOne(dbDto);
  }
  async updateDevice(
    deviceId: string,
    updatedDbDto: UPDATEsecurityDeviceDbDto,
  ) {
    await getSecurityDeviceCollection().updateOne(
      { deviceId: deviceId },
      { $set: updatedDbDto },
    );
  }
  async deleteDevice(deviceId: string): Promise<{ count: number }> {
    const result = await getSecurityDeviceCollection().deleteOne({ deviceId });
    return { count: result.deletedCount ?? 0 };
  }
  async deleteAllDevices() {
    return getSecurityDeviceCollection().deleteMany({});
  }
  async deleteAllDevicesExcludeCurrent(deviceId: string) {
    await getSecurityDeviceCollection().deleteMany({
      deviceId: { $ne: deviceId },
    });
  }
}
