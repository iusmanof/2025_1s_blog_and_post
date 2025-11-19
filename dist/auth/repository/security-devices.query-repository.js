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
exports.SecurityDevicesQueryRepository = void 0;
const mongo_db_1 = require("../../core/db/mongo.db");
class SecurityDevicesQueryRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, mongo_db_1.getSecurityDeviceCollection)().find({}).toArray();
        });
    }
    geByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, mongo_db_1.getSecurityDeviceCollection)().findOne({ deviceId: deviceId });
        });
    }
    findByIdAndIat(deviceId, iat) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, mongo_db_1.getSecurityDeviceCollection)().findOne({
                deviceId: deviceId,
                lastActivateDate: iat,
            });
        });
    }
}
exports.SecurityDevicesQueryRepository = SecurityDevicesQueryRepository;
//# sourceMappingURL=security-devices.query-repository.js.map