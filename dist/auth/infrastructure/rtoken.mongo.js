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
exports.RTokenMongooseModel = exports.rtokenSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.rtokenSchema = new mongoose_1.default.Schema({ token: { type: String, required: true } }, { timestamps: true });
exports.rtokenSchema.statics.addTokenInBlackList = function (token) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.create({ token });
    });
};
exports.rtokenSchema.statics.findRefreshTokenInBlackList = function (token) {
    return this.findOne({ token }).exec();
};
exports.rtokenSchema.statics.deleteRefreshTokenBlackList = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.deleteMany({}).exec();
    });
};
exports.RTokenMongooseModel = mongoose_1.default.model("rtoken", exports.rtokenSchema);
//# sourceMappingURL=rtoken.mongo.js.map