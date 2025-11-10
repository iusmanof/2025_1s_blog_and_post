import {SecurityDeviceDbDto} from "../types/security-device-db.dto";
import {securityDevicesRepository} from "../repository/security-devices.repository";
import {securityDevicesQueryRepository} from "../repository/security-devices.query-repository";
import {ResultObject, resultStatus} from "../../core/types/result-object";
import {jwtAdapter} from "../adapters/jwt.adapter";


export const securityDevicesService = {
    async getDevices(refreshToken: string): Promise<any[]> {

        const decoded = await jwtAdapter.decodeToken(refreshToken);
        const devices = await securityDevicesRepository.findAllDevicesByUserId(decoded.id);

        return devices.map(d => {
            return {
                ip: d.ip,
                title: d.title,
                lastActiveDate: new Date(+d.lastActivateDate * 1000).toISOString(),
                deviceId: d.deviceId,
            }
        })
    },
    async setDevice(dto: SecurityDeviceDbDto) {
        await securityDevicesRepository.addDevice(dto)
    },
    async deleteById(deviceId: string): Promise<ResultObject<string | null>> {
        // DeviceId not found
        const result = await securityDevicesQueryRepository.geByDeviceId(deviceId)
        if (!result) {
            return {
                status: resultStatus.NOT_FOUND,
                errorMessages: 'DeviceId not found',
                extensions: [{message: 'DeviceId not found', field: 'DeviceId'}],
                data: null
            }
        }

        await securityDevicesRepository.deleteDevice(deviceId)
        return {
            status: resultStatus.SUCCESS,
            extensions: [],
            data: null
        };
    },
    async terminateAllSessionExcludeCurrent(refreshToken: string){
        const decoded = await jwtAdapter.decodeToken(refreshToken);

        await securityDevicesRepository.deleteAllDevicesExcludeCurrent(decoded.deviceId);
    }
}
