"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityDevicesService = void 0;
const result_object_1 = require("../../core/types/result-object");
class SecurityDevicesService {
    constructor(jwtAdapter, securityDevicesRepository, securityDevicesQueryRepository) {
        this.jwtAdapter = jwtAdapter;
        this.securityDevicesRepository = securityDevicesRepository;
        this.securityDevicesQueryRepository = securityDevicesQueryRepository;
    }
    getDevices(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = yield this.jwtAdapter.decodeToken(refreshToken);
            const devices = yield this.securityDevicesRepository.findAllDevicesByUserId(decoded.id);
            return devices.map((d) => {
                return {
                    ip: d.ip,
                    title: d.title,
                    lastActiveDate: new Date(+d.lastActivateDate * 1000).toISOString(),
                    deviceId: d.deviceId,
                };
            });
        });
    }
    setDevice(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.securityDevicesRepository.addDevice(dto);
        });
    }
    deleteById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.securityDevicesQueryRepository.geByDeviceId(deviceId);
            if (!result) {
                return {
                    status: result_object_1.resultStatus.NOT_FOUND,
                    errorMessages: "DeviceId not found",
                    extensions: [{ message: "DeviceId not found", field: "DeviceId" }],
                    data: null,
                };
            }
            yield this.securityDevicesRepository.deleteDevice(deviceId);
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: null,
            };
        });
    }
    terminateAllSessionExcludeCurrent(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = yield this.jwtAdapter.decodeToken(refreshToken);
            yield this.securityDevicesRepository.deleteAllDevicesExcludeCurrent(decoded.deviceId);
        });
    }
}
exports.SecurityDevicesService = SecurityDevicesService;
//# sourceMappingURL=security-devices.service.js.map