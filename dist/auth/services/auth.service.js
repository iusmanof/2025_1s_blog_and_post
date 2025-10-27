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
const result_object_1 = require("../../core/types/result-object");
const jwt_adapter_1 = require("../adapters/jwt.adapter");
const crypto_1 = require("crypto");
const email_adapter_1 = require("../adapters/email.adapter");
const date_fns_1 = require("date-fns");
const email_example_template_1 = require("../../core/types/email-example.template");
exports.authService = {
    login(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: 'Unauthorized',
                    extensions: [{ message: "Not found", field: "loginOrEmail" }],
                    data: null
                };
            }
            const passwordCorrect = yield bcrypt_adapter_1.bcryptAdapter.checkPassword(password, user.password);
            if (!passwordCorrect) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: 'Bad request',
                    extensions: [{ message: "Wrong password", field: "password" }],
                    data: null
                };
            }
            const accessToken = yield jwt_adapter_1.jwtAdapter.signToken(user._id.toString());
            return {
                status: result_object_1.resultStatus.SUCCESS,
                data: { accessToken },
                extensions: [],
            };
        });
    },
    registerUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield bcrypt_adapter_1.bcryptAdapter.generateHash(password);
            const newUser = {
                login: login,
                email: email,
                password: passwordHash,
                createdAt: new Date(),
                emailConfirmation: {
                    confirmationCode: (0, crypto_1.randomUUID)(),
                    expirationDate: (0, date_fns_1.add)(new Date(), { hours: 1, minutes: 30 }),
                    isConfirmed: false,
                }
            };
            yield users_repository_1.usersRepository.create(newUser);
            if (newUser.emailConfirmation) {
                try {
                    yield email_adapter_1.emailAdapter.nodemailer(email, email_example_template_1.emailExampleTemplate.registrationEmail(newUser.emailConfirmation.confirmationCode));
                }
                catch (err) {
                    console.log("send email error");
                }
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: "code send"
            };
        });
    },
    confirmUser(code) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield users_repository_1.usersRepository.findByConfirmationCode(code);
            // if (!user || !user.emailConfirmation || !user.emailConfirmation.expirationDate) {
            if (!user) {
                return {
                    status: result_object_1.resultStatus.BAD_REQUEST,
                    errorMessages: 'Bad request',
                    extensions: [{ message: "Invalid code", field: "code" }],
                    data: null
                };
            }
            if (user.emailConfirmation.isConfirmed) {
                return {
                    status: result_object_1.resultStatus.BAD_REQUEST,
                    errorMessages: "Bad request",
                    extensions: [{ message: "Code already confirmed", field: "code" }],
                    data: null
                };
            }
            if (((_a = user.emailConfirmation) === null || _a === void 0 ? void 0 : _a.expirationDate) < new Date()) {
                return {
                    status: result_object_1.resultStatus.CODE_EXPIRED,
                    errorMessages: 'Bad request',
                    extensions: [{ message: "Code expired", field: "code" }],
                    data: null
                };
            }
            yield users_repository_1.usersRepository.confirmCode(code);
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: user
            };
        });
    },
    resendCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield users_repository_1.usersRepository.findByEmail(email);
            if (!user) {
                return {
                    status: result_object_1.resultStatus.NOT_FOUND,
                    errorMessages: 'Email not found',
                    extensions: [{ message: 'Email not exists', field: 'email' }],
                    data: null
                };
            }
            if ((_a = user.emailConfirmation) === null || _a === void 0 ? void 0 : _a.isConfirmed) {
                return {
                    status: result_object_1.resultStatus.BAD_REQUEST,
                    errorMessages: 'Bad request',
                    extensions: [{ message: "Email is already confirmed", field: "email" }],
                    data: null
                };
            }
            const codeRefreshed = (0, crypto_1.randomUUID)();
            yield users_repository_1.usersRepository.findBYEmailAndRefreshCode(email, codeRefreshed);
            try {
                yield email_adapter_1.emailAdapter.nodemailer(email, email_example_template_1.emailExampleTemplate.registrationEmail(codeRefreshed));
            }
            catch (err) {
                console.log("send email error");
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: null
            };
        });
    }
};
//# sourceMappingURL=auth.service.js.map