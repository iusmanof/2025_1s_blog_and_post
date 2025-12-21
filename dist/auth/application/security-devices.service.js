"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const inversify_1 = require("inversify");
const result_object_1 = require("../../core/types/result-object");
const jwt_adapter_1 = require("./adapters/jwt.adapter");
const security_devices_repository_1 = require("../infrastructure/security-devices.repository");
const security_devices_query_repository_1 = require("../infrastructure/security-devices.query-repository");
let SecurityDevicesService = class SecurityDevicesService {
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
};
exports.SecurityDevicesService = SecurityDevicesService;
exports.SecurityDevicesService = SecurityDevicesService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(jwt_adapter_1.JwtAdapter)),
    __param(1, (0, inversify_1.inject)(security_devices_repository_1.SecurityDevicesRepository)),
    __param(2, (0, inversify_1.inject)(security_devices_query_repository_1.SecurityDevicesQueryRepository)),
    __metadata("design:paramtypes", [jwt_adapter_1.JwtAdapter,
        security_devices_repository_1.SecurityDevicesRepository,
        security_devices_query_repository_1.SecurityDevicesQueryRepository])
], SecurityDevicesService);
//# sourceMappingURL=security-devices.service.js.map