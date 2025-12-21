"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UsersRepository = void 0;
const inversify_1 = require("inversify");
const mongodb_1 = require("mongodb");
const date_fns_1 = require("date-fns");
const user_entity_1 = require("../domain/user.entity");
let UsersRepository = class UsersRepository {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
            const [items, totalCount] = yield Promise.all([
                user_entity_1.UserMongooseModel.find()
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(+pageSize)
                    .lean(),
                user_entity_1.UserMongooseModel.countDocuments({}),
            ]);
            return { items, totalCount };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return null;
            }
            return user_entity_1.UserMongooseModel.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    }
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_entity_1.UserMongooseModel.findOne({
                $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
            });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_entity_1.UserMongooseModel.findOne({ email: email });
        });
    }
    findByLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_entity_1.UserMongooseModel.findOne({ login: login });
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield user_entity_1.UserMongooseModel.create(user);
            return newUser._id.toString();
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield user_entity_1.UserMongooseModel.deleteOne({
                _id: new mongodb_1.ObjectId(id),
            });
            return deleteResult.deletedCount === 1;
        });
    }
    deleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_entity_1.UserMongooseModel.deleteMany({});
        });
    }
    findByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_entity_1.UserMongooseModel.findOne({
                "emailConfirmation.confirmationCode": code,
            });
        });
    }
    findBYEmailAndRefreshCode(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_entity_1.UserMongooseModel.updateOne({ email }, {
                $set: {
                    "emailConfirmation.confirmationCode": code,
                    "emailConfirmation.expirationDate": (0, date_fns_1.add)(new Date(), {
                        hours: 1,
                        minutes: 30,
                    }),
                },
            });
        });
    }
    confirmCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_entity_1.UserMongooseModel.updateOne({ "emailConfirmation.confirmationCode": code }, { $set: { "emailConfirmation.isConfirmed": true } });
        });
    }
    setRecoveryCode(email, recoveryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_entity_1.UserMongooseModel.updateOne({ email }, {
                $set: {
                    passwordRecovery: {
                        recoveryCode,
                        expirationDate: (0, date_fns_1.add)(new Date(), { hours: 1 }), // код действителен 1 час
                    },
                },
            });
        });
    }
    findByRecoveryCode(recoveryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_entity_1.UserMongooseModel.findOne({
                "passwordRecovery.recoveryCode": recoveryCode,
            });
        });
    }
    updatePasswordByRecoveryCode(recoveryCode, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_entity_1.UserMongooseModel.updateOne({ "passwordRecovery.recoveryCode": recoveryCode }, {
                $set: { password: hashedPassword },
                $unset: { passwordRecovery: "" }, // удаляем код после смены пароля
            });
        });
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersRepository);
//# sourceMappingURL=users.repository.js.map