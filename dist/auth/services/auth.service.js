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
const auth_repository_1 = require("../repository/auth.repository");
const users_query_repository_1 = require("../../users/repositories/users.query.repository");
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
            const accessToken = yield jwt_adapter_1.jwtAdapter.signAccessToken(user._id.toString());
            const refreshToken = yield jwt_adapter_1.jwtAdapter.signRefreshToken(user._id.toString());
            // console.log(accessToken)
            console.log(refreshToken);
            return {
                status: result_object_1.resultStatus.SUCCESS,
                data: { accessToken, refreshToken },
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
    },
    updateTokens(rf) {
        return __awaiter(this, void 0, void 0, function* () {
            const isBlackListed = yield auth_repository_1.authRepository.findRefreshTokenInBlackList(rf);
            if (isBlackListed) {
                return {
                    status: result_object_1.resultStatus.UNAUTORIZED,
                    data: null,
                    errorMessages: 'Refresh Token',
                    extensions: [{ message: "refresh token in black list", field: "refresh token" }],
                };
            }
            const decoded = yield jwt_adapter_1.jwtAdapter.decodeToken(rf);
            if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
                return {
                    status: result_object_1.resultStatus.BAD_REQUEST,
                    data: null,
                    extensions: []
                };
            }
            const a = {
                // refactoring?
                id: decoded.id,
                iat: decoded.iat,
            };
            const accessToken = yield jwt_adapter_1.jwtAdapter.signAccessToken(a.id.toString());
            const refreshToken = yield jwt_adapter_1.jwtAdapter.signRefreshToken(a.id.toString());
            yield auth_repository_1.authRepository.addTokenInBlackList(rf);
            return {
                status: result_object_1.resultStatus.SUCCESS,
                data: { accessToken, refreshToken },
                extensions: [],
            };
        });
    },
    expireToken(rftoken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isBlackListed = yield auth_repository_1.authRepository.findRefreshTokenInBlackList(rftoken);
                if (isBlackListed) {
                    return {
                        status: result_object_1.resultStatus.UNAUTORIZED,
                        data: null,
                        errorMessages: 'Refresh Token',
                        extensions: [{ message: "refresh token in black list", field: "refresh token" }],
                    };
                }
                yield auth_repository_1.authRepository.addTokenInBlackList(rftoken);
                return {
                    status: result_object_1.resultStatus.SUCCESS,
                    extensions: [],
                    data: 'token added successfully'
                };
            }
            catch (err) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    data: null,
                    extensions: [],
                };
            }
        });
    },
    getMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield users_query_repository_1.usersQueryRepository.findById(userId);
            if (!result)
                return null;
            return {
                login: result === null || result === void 0 ? void 0 : result.login,
                email: result === null || result === void 0 ? void 0 : result.email,
                userId: result === null || result === void 0 ? void 0 : result.id
            };
        });
    }
};
//# sourceMappingURL=auth.service.js.map