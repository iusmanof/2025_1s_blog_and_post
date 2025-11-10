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
exports.securityDevicesService = void 0;
const security_devices_repository_1 = require("../repository/security-devices.repository");
const security_devices_query_repository_1 = require("../repository/security-devices.query-repository");
const result_object_1 = require("../../core/types/result-object");
const jwt_adapter_1 = require("../adapters/jwt.adapter");
exports.securityDevicesService = {
    getDevices(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = yield jwt_adapter_1.jwtAdapter.decodeToken(refreshToken);
            const devices = yield security_devices_repository_1.securityDevicesRepository.findAllDevicesByUserId(decoded.id);
            return devices.map(d => {
                return {
                    ip: d.ip,
                    title: d.title,
                    lastActiveDate: new Date(+d.lastActivateDate * 1000).toISOString(),
                    deviceId: d.deviceId,
                };
            });
        });
    },
    setDevice(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield security_devices_repository_1.securityDevicesRepository.addDevice(dto);
        });
    },
    deleteById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            // DeviceId not found
            const result = yield security_devices_query_repository_1.securityDevicesQueryRepository.geByDeviceId(deviceId);
            if (!result) {
                return {
                    status: result_object_1.resultStatus.NOT_FOUND,
                    errorMessages: 'DeviceId not found',
                    extensions: [{ message: 'DeviceId not found', field: 'DeviceId' }],
                    data: null
                };
            }
            yield security_devices_repository_1.securityDevicesRepository.deleteDevice(deviceId);
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: null
            };
        });
    },
    terminateAllSessionExcludeCurrent(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = yield jwt_adapter_1.jwtAdapter.decodeToken(refreshToken);
            yield security_devices_repository_1.securityDevicesRepository.deleteAllDevicesExcludeCurrent(decoded.deviceId);
        });
    }
};
//# sourceMappingURL=security-devices.service.js.map