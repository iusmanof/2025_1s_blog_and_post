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
exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
const users_repository_1 = require("../../../users/repositories/users.repository");
exports.loginValidation = (0, express_validator_1.body)("login")
    .isString()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Login is not correct")
    .custom((login) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_repository_1.usersRepository.findByLoginOrEmail(login);
    if (user) {
        throw new Error("login already exist");
    }
    return true;
}));
//# sourceMappingURL=login.validation-middleware.js.map