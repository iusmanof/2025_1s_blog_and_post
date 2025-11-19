import { SecurityDeviceDbDto } from "../types/security-device-db.dto";
import { ResultObject, resultStatus } from "../../core/types/result-object";
import {JwtAdapter} from "../adapters/jwt.adapter";
import {SecurityDevicesRepository} from "../repository/security-devices.repository";
import {SecurityDevicesQueryRepository} from "../repository/security-devices.query-repository";

export class SecurityDevicesService {
    constructor(
        public readonly jwtAdapter: JwtAdapter,
        public readonly securityDevicesRepository: SecurityDevicesRepository,
        public readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
    ) {}
  async getDevices(refreshToken: string): Promise<any[]> {
    const decoded = await this.jwtAdapter.decodeToken(refreshToken);
    const devices = await this.securityDevicesRepository.findAllDevicesByUserId(
      decoded.id,
    );

    return devices.map((d) => {
      return {
        ip: d.ip,
        title: d.title,
        lastActiveDate: new Date(+d.lastActivateDate * 1000).toISOString(),
        deviceId: d.deviceId,
      };
    });
  }
  async setDevice(dto: SecurityDeviceDbDto) {
    await this.securityDevicesRepository.addDevice(dto);
  }
  async deleteById(deviceId: string): Promise<ResultObject<string | null>> {
    const result = await this.securityDevicesQueryRepository.geByDeviceId(deviceId);
    if (!result) {
      return {
        status: resultStatus.NOT_FOUND,
        errorMessages: "DeviceId not found",
        extensions: [{ message: "DeviceId not found", field: "DeviceId" }],
        data: null,
      };
    }

    await this.securityDevicesRepository.deleteDevice(deviceId);
    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: null,
    };
  }
  async terminateAllSessionExcludeCurrent(refreshToken: string) {
    const decoded = await this.jwtAdapter.decodeToken(refreshToken);

    await this.securityDevicesRepository.deleteAllDevicesExcludeCurrent(
      decoded.deviceId,
    );
  }
}
