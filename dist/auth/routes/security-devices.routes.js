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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityDevicesRouter = void 0;
const express_1 = require("express");
const http_status_code_1 = __importDefault(require("../../core/types/http-status-code"));
const security_devices_service_1 = require("../services/security-devices.service");
const result_object_1 = require("../../core/types/result-object");
const refresh_token_middleware_1 = require("../middlewares/refresh-token.middleware");
const user_id_belongs_to_another_middleware_1 = require("../middlewares/user-id-belongs-to-another.middleware");
exports.securityDevicesRouter = (0, express_1.Router)();
exports.securityDevicesRouter.get('/', refresh_token_middleware_1.verifyRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const devices = yield security_devices_service_1.securityDevicesService.getDevices(refreshToken);
    if (!devices) {
        res.sendStatus(http_status_code_1.default.UNAUTHORIZED_401).json({ error: "Unauthorized" });
    }
    res.status(http_status_code_1.default.OK_200).send(devices);
}));
exports.securityDevicesRouter.delete('/', refresh_token_middleware_1.verifyRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    yield security_devices_service_1.securityDevicesService.terminateAllSessionExcludeCurrent(refreshToken);
    res.status(http_status_code_1.default.NO_CONTENT_204).json({ message: "Delete all devices" });
}));
exports.securityDevicesRouter.delete('/:deviceId', refresh_token_middleware_1.verifyRefreshToken, user_id_belongs_to_another_middleware_1.userIdBelongsToAnotherMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceId = req.params.deviceId;
    const result = yield security_devices_service_1.securityDevicesService.deleteById(deviceId);
    if (result.status === result_object_1.resultStatus.NOT_FOUND) {
        res.status(http_status_code_1.default.NOT_FOUND_404).json({ errorsMessages: result.extensions });
        return;
    }
    res.status(http_status_code_1.default.NO_CONTENT_204).json({ test: "test" });
}));
//# sourceMappingURL=security-devices.routes.js.map