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
exports.authService = void 0;
const users_repository_1 = require("../../users/repositories/users.repository");
const bcrypt_adapter_1 = require("../adapters/bcrypt.adapter");
exports.authService = {
    login(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user) {
                return {
                    "errorsMessages": [
                        {
                            "message": "Not found",
                            "field": "loginOrEmail"
                        }
                    ]
                };
            }
            const passwordCorrect = yield bcrypt_adapter_1.bcryptAdapter.checkPassword(password, user.passwordhash);
            if (!passwordCorrect) {
                return {
                    "errorsMessages": [
                        {
                            "message": "Wrong password",
                            "field": "password"
                        }
                    ]
                };
            }
            return true;
        });
    },
};
//# sourceMappingURL=auth.service.js.map