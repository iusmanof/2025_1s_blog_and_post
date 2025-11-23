"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityDevicesRouter = void 0;
const express_1 = require("express");
const refresh_token_middleware_1 = require("../middlewares/refresh-token.middleware");
const user_id_belongs_to_another_middleware_1 = require("../middlewares/user-id-belongs-to-another.middleware");
const composition_root_1 = require("../../composition.root");
const security_devices_controller_1 = require("../controllers/security-devices.controller");
const securityDeviceController = composition_root_1.container.get(security_devices_controller_1.SecurityDeviceController);
exports.securityDevicesRouter = (0, express_1.Router)();
exports.securityDevicesRouter.get("/", refresh_token_middleware_1.verifyRefreshToken, securityDeviceController.getAllDevices);
exports.securityDevicesRouter.delete("/", refresh_token_middleware_1.verifyRefreshToken, securityDeviceController.deleteAllSessionExcludeCurrent);
exports.securityDevicesRouter.delete("/:deviceId", refresh_token_middleware_1.verifyRefreshToken, user_id_belongs_to_another_middleware_1.userIdBelongsToAnotherMiddleware, securityDeviceController.deleteById);
//# sourceMappingURL=security-devices.routes.js.map