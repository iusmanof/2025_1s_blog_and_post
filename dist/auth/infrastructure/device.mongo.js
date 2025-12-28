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
exports.DeviceMongooseModel = exports.deviceSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.deviceSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    lastActivateDate: { type: Date, required: true },
    deviceId: { type: String, required: true },
    userId: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    ip: { type: String, required: true },
});
exports.deviceSchema.statics.findAll = function () {
    return this.find({}).exec();
};
exports.deviceSchema.statics.geByDeviceId = function (deviceId) {
    return this.findOne({ deviceId }).exec();
};
exports.deviceSchema.statics.findByIdAndIat = function (deviceId, iat) {
    return this.findOne({ deviceId, lastActivateDate: iat }).exec();
};
exports.deviceSchema.statics.findAllDevicesByUserId = function (userId) {
    return this.find({ userId }).exec();
};
exports.deviceSchema.statics.addDevice = function (dto) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.create(dto);
    });
};
exports.deviceSchema.statics.updateDevice = function (deviceId, updatedDbDto) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.updateOne({ deviceId }, { $set: updatedDbDto }).exec();
    });
};
exports.deviceSchema.statics.deleteDevice = function (deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const res = yield this.deleteOne({ deviceId }).exec();
        return { count: (_a = res.deletedCount) !== null && _a !== void 0 ? _a : 0 };
    });
};
exports.deviceSchema.statics.deleteAllDevices = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.deleteMany({}).exec();
    });
};
exports.deviceSchema.statics.deleteAllDevicesExcludeCurrent = function (deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.deleteMany({ deviceId: { $ne: deviceId } }).exec();
    });
};
exports.DeviceMongooseModel = mongoose_1.default.model("device", exports.deviceSchema);
//# sourceMappingURL=device.mongo.js.map