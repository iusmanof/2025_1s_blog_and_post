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
exports.AuthRepository = void 0;
const mongo_db_1 = require("../../core/db/mongo.db");
class AuthRepository {
    addTokenInBlackList(rfToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, mongo_db_1.getRefreshTokenCollection)().insertOne({
                token: rfToken,
                createdAt: new Date(),
            });
        });
    }
    findRefreshTokenInBlackList(refresh_token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, mongo_db_1.getRefreshTokenCollection)().findOne({ token: refresh_token });
        });
    }
    deleteRefreshTokenBlackList() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, mongo_db_1.getRefreshTokenCollection)().deleteMany({});
        });
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map