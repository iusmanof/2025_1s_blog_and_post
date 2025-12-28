import { injectable } from "inversify";
import { DeviceMongooseModel } from "./device.mongo";

@injectable()
export class SecurityDevicesQueryRepository {
  async findAll() {
    return DeviceMongooseModel.findAll();
  }

  async geByDeviceId(deviceId: string) {
    return DeviceMongooseModel.geByDeviceId(deviceId);
  }

  async findByIdAndIat(deviceId: string, iat: number) {
    return DeviceMongooseModel.findByIdAndIat(deviceId, iat);
  }
}
