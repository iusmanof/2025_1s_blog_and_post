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
exports.usersRepository = void 0;
const mongo_db_1 = require("../../core/db/mongo.db");
const mongodb_1 = require("mongodb");
exports.usersRepository = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
            const filter = {};
            const skip = (pageNumber - 1) * pageSize;
            const [items, totalCount] = yield Promise.all([
                (0, mongo_db_1.getUserCollection)()
                    .find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(+pageSize)
                    .toArray(),
                (0, mongo_db_1.getUserCollection)().countDocuments(filter),
            ]);
            return { items, totalCount };
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return null;
            }
            return (0, mongo_db_1.getUserCollection)().findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mongo_db_1.getUserCollection)().findOne({
                $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
            });
        });
    },
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield (0, mongo_db_1.getUserCollection)().insertOne(Object.assign({}, user));
            return newUser.insertedId.toString();
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield (0, mongo_db_1.getUserCollection)().deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return deleteResult.deletedCount === 1;
        });
    },
    deleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, mongo_db_1.getUserCollection)().deleteMany({});
        });
    }
};
//# sourceMappingURL=users.repository.js.map