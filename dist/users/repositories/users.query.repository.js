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
exports.usersQueryRepository = void 0;
const mongo_db_1 = require("../../core/db/mongo.db");
const mongodb_1 = require("mongodb");
exports.usersQueryRepository = {
    findAllUsers(sortQueryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortBy, sortDirection, pageSize, pageNumber } = sortQueryDto;
            const skip = (pageNumber - 1) * pageSize;
            const loginAndEmailSearch = {};
            const totalCount = yield (0, mongo_db_1.getUserCollection)().countDocuments();
            const users = yield (0, mongo_db_1.getUserCollection)().find(loginAndEmailSearch)
                .sort({ [sortBy]: sortDirection })
                .skip(+skip)
                .limit(+pageSize)
                .toArray();
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount,
                items: users.map((u) => this._getInView(u)),
            };
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, mongo_db_1.getUserCollection)().findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!user) {
                return null;
            }
            return this._getInView(user);
        });
    },
    _getInView(user) {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt ? user.createdAt.toISOString() : null,
        };
    },
};
//# sourceMappingURL=users.query.repository.js.map