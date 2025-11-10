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
exports.securityDevicesRepository = void 0;
const mongo_db_1 = require("../../core/db/mongo.db");
exports.securityDevicesRepository = {
    findAllDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, mongo_db_1.getSecurityDeviceCollection)().find().toArray();
        });
    },
    findAllDevicesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, mongo_db_1.getSecurityDeviceCollection)().find({ userId }).toArray();
        });
    },
    addDevice(dbDto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, mongo_db_1.getSecurityDeviceCollection)().insertOne(dbDto);
        });
    },
    updateDevice(deviceId, updatedDbDto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, mongo_db_1.getSecurityDeviceCollection)().updateOne({ deviceId: deviceId }, { $set: updatedDbDto });
        });
    },
    deleteDevice(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield (0, mongo_db_1.getSecurityDeviceCollection)().deleteOne({ deviceId });
            return { count: (_a = result.deletedCount) !== null && _a !== void 0 ? _a : 0 };
        });
    },
    deleteAllDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mongo_db_1.getSecurityDeviceCollection)().deleteMany({});
        });
    },
    deleteAllDevicesExcludeCurrent(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, mongo_db_1.getSecurityDeviceCollection)().deleteMany({ deviceId: { $ne: deviceId } });
        });
    }
};
//# sourceMappingURL=security-devices.repository.js.map