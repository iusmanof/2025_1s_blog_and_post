import { injectable } from "inversify";
import { HydratedDocument } from "mongoose";
import { IDevice } from "../types/device";
import { DeviceMongooseModel } from "../domain/device.entity";

@injectable()
export class SecurityDevicesQueryRepository {
  async findAll(): Promise<HydratedDocument<IDevice>[]> {
    return await DeviceMongooseModel.find({}).exec();
  }
  async geByDeviceId(
    deviceId: string,
  ): Promise<HydratedDocument<IDevice> | null> {
    return await DeviceMongooseModel.findOne({ deviceId: deviceId }).exec();
  }
  async findByIdAndIat(
    deviceId: string,
    iat: number,
  ): Promise<HydratedDocument<IDevice> | null> {
    return await DeviceMongooseModel.findOne({
      deviceId: deviceId,
      lastActivateDate: iat,
    }).exec();
  }
}
