import { getSecurityDeviceCollection } from "../../core/db/mongo.db";
import { SecurityDeviceDbDto } from "../types/security-device-db.dto";

export class SecurityDevicesQueryRepository {
  async findAll(): Promise<SecurityDeviceDbDto[]> {
    return await getSecurityDeviceCollection().find({}).toArray();
  }
  async geByDeviceId(deviceId: string): Promise<SecurityDeviceDbDto | null> {
    return await getSecurityDeviceCollection().findOne({ deviceId: deviceId });
  }
  async findByIdAndIat(
    deviceId: string,
    iat: number,
  ): Promise<SecurityDeviceDbDto | null> {
    return await getSecurityDeviceCollection().findOne({
      deviceId: deviceId,
      lastActivateDate: iat,
    });
  }
}
