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
exports.usersService = void 0;
const users_repository_1 = require("../repositories/users.repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.usersService = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repository_1.usersRepository.findMany(queryDto);
        });
    },
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password, email } = dto;
            const salt = yield bcrypt_1.default.genSalt(10);
            const passwordhash = yield bcrypt_1.default.hash(password, salt);
            const newUser = {
                login,
                email,
                passwordhash,
                createdAt: new Date(),
            };
            return yield users_repository_1.usersRepository.create(newUser);
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findById(id);
            if (!user) {
                return false;
            }
            return yield users_repository_1.usersRepository.delete(id);
        });
    }
};
//# sourceMappingURL=users.service.js.map