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
exports.emailRegistrationValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const composition_root_1 = require("../../composition.root");
const users_repository_1 = require("../../users/infrastructure/users.repository");
const usersRepository = composition_root_1.container.get(users_repository_1.UsersRepository);
exports.emailRegistrationValidationMiddleware = (0, express_validator_1.body)("email")
    .trim()
    .isEmail()
    .matches(/^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/)
    .withMessage("Email is not correct")
    .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersRepository.findByEmail(email);
    if (user) {
        throw new Error("Email already exists");
    }
    return true;
}));
//# sourceMappingURL=email-registration-validation.middleware.js.map