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
exports.AuthService = void 0;
const result_object_1 = require("../../core/types/result-object");
const crypto_1 = require("crypto");
const date_fns_1 = require("date-fns");
const email_example_template_1 = require("../adapters/email-example.template");
const uuid_1 = require("uuid");
class AuthService {
    constructor(jwtAdapter, emailAdapter, bcryptAdapter, securityDevicesService, securityDevicesQueryRepository, securityDevicesRepository, usersQueryRepository, usersRepository) {
        this.jwtAdapter = jwtAdapter;
        this.emailAdapter = emailAdapter;
        this.bcryptAdapter = bcryptAdapter;
        this.securityDevicesService = securityDevicesService;
        this.securityDevicesQueryRepository = securityDevicesQueryRepository;
        this.securityDevicesRepository = securityDevicesRepository;
        this.usersQueryRepository = usersQueryRepository;
        this.usersRepository = usersRepository;
    }
    login(loginOrEmail, password, ipAddr, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Unauthorized",
                    extensions: [{ message: "Not found", field: "loginOrEmail" }],
                    data: null,
                };
            }
            const passwordCorrect = yield this.bcryptAdapter.checkPassword(password, user.password);
            if (!passwordCorrect) {
                return {
                    status: result_object_1.resultStatus.ERROR,
                    errorMessages: "Bad request",
                    extensions: [{ message: "Wrong password", field: "password" }],
                    data: null,
                };
            }
            const accessToken = yield this.jwtAdapter.signAccessToken(user._id.toString());
            const deviceId = (0, uuid_1.v4)();
            const refreshToken = yield this.jwtAdapter.signRefreshToken(user._id.toString(), ipAddr, userAgent, deviceId);
            const { id: payloadId, iat: payloadIat, exp: payloadExp, } = yield this.jwtAdapter.parseJwtPayloadIat(refreshToken);
            const securityDeviceDTO = {
                userId: payloadId,
                title: userAgent,
                ip: ipAddr,
                expiryDate: payloadExp,
                lastActivateDate: payloadIat,
                deviceId: deviceId,
            };
            yield this.securityDevicesService.setDevice(securityDeviceDTO);
            return {
                status: result_object_1.resultStatus.SUCCESS,
                data: { accessToken, refreshToken },
                extensions: [],
            };
        });
    }
    registerUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield this.bcryptAdapter.generateHash(password);
            const newUser = {
                login: login,
                email: email,
                password: passwordHash,
                createdAt: new Date(),
                emailConfirmation: {
                    confirmationCode: (0, crypto_1.randomUUID)(),
                    expirationDate: (0, date_fns_1.add)(new Date(), { hours: 1, minutes: 30 }),
                    isConfirmed: false,
                },
            };
            yield this.usersRepository.create(newUser);
            if (newUser.emailConfirmation) {
                try {
                    yield this.emailAdapter.nodemailer(email, email_example_template_1.emailExampleTemplate.registrationEmail(newUser.emailConfirmation.confirmationCode));
                }
                catch (err) {
                    console.log("send email error");
                }
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: "code send",
            };
        });
    }
    confirmUser(code) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this.usersRepository.findByConfirmationCode(code);
            if (!user) {
                return {
                    status: result_object_1.resultStatus.BAD_REQUEST,
                    errorMessages: "Bad request",
                    extensions: [{ message: "Invalid code", field: "code" }],
                    data: null,
                };
            }
            if (user.emailConfirmation.isConfirmed) {
                return {
                    status: result_object_1.resultStatus.BAD_REQUEST,
                    errorMessages: "Bad request",
                    extensions: [{ message: "Code already confirmed", field: "code" }],
                    data: null,
                };
            }
            if (((_a = user.emailConfirmation) === null || _a === void 0 ? void 0 : _a.expirationDate) < new Date()) {
                return {
                    status: result_object_1.resultStatus.CODE_EXPIRED,
                    errorMessages: "Bad request",
                    extensions: [{ message: "Code expired", field: "code" }],
                    data: null,
                };
            }
            yield this.usersRepository.confirmCode(code);
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: user,
            };
        });
    }
    resendCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this.usersRepository.findByEmail(email);
            if (!user) {
                return {
                    status: result_object_1.resultStatus.NOT_FOUND,
                    errorMessages: "Email not found",
                    extensions: [{ message: "Email not exists", field: "email" }],
                    data: null,
                };
            }
            if ((_a = user.emailConfirmation) === null || _a === void 0 ? void 0 : _a.isConfirmed) {
                return {
                    status: result_object_1.resultStatus.BAD_REQUEST,
                    errorMessages: "Bad request",
                    extensions: [{ message: "Email is already confirmed", field: "email" }],
                    data: null,
                };
            }
            const codeRefreshed = (0, crypto_1.randomUUID)();
            yield this.usersRepository.findBYEmailAndRefreshCode(email, codeRefreshed);
            try {
                yield this.emailAdapter.nodemailer(email, email_example_template_1.emailExampleTemplate.registrationEmail(codeRefreshed));
            }
            catch (err) {
                console.log("send email error");
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                extensions: [],
                data: null,
            };
        });
    }
    updateToken(rf, ipAddr, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = yield this.jwtAdapter.decodeToken(rf);
            const oldDevice = yield this.securityDevicesQueryRepository.findByIdAndIat(decoded.deviceId, decoded.iat);
            if (!oldDevice) {
                return {
                    status: result_object_1.resultStatus.UNAUTORIZED,
                    data: null,
                    errorMessages: "Refresh Token",
                    extensions: [
                        {
                            message: "refresh token expired or invalid",
                            field: "refresh token",
                        },
                    ],
                };
            }
            const accessToken = yield this.jwtAdapter.signAccessToken(decoded.id.toString());
            const refreshToken = yield this.jwtAdapter.signRefreshToken(decoded.id.toString(), ipAddr, userAgent, decoded.deviceId);
            const { iat: newIat, exp: newExp } = yield this.jwtAdapter.parseJwtPayloadIat(refreshToken);
            yield this.securityDevicesRepository.updateDevice(decoded.deviceId, {
                lastActivateDate: newIat,
                ip: ipAddr,
                title: userAgent,
                expiryDate: newExp,
            });
            return {
                status: result_object_1.resultStatus.SUCCESS,
                data: { accessToken, refreshToken },
                extensions: [],
            };
        });
    }
    expireToken(rftoken) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = yield this.jwtAdapter.decodeToken(rftoken);
            const oldDevice = yield this.securityDevicesQueryRepository.findByIdAndIat(decoded.deviceId, decoded.iat);
            if (!oldDevice) {
                return {
                    status: result_object_1.resultStatus.UNAUTORIZED,
                    data: null,
                    errorMessages: "Refresh Token",
                    extensions: [
                        {
                            message: "refresh token expired or invalid",
                            field: "refresh token",
                        },
                    ],
                };
            }
            const { count } = yield this.securityDevicesRepository.deleteDevice(decoded.deviceId);
            if (count === 0) {
                return {
                    status: result_object_1.resultStatus.UNAUTORIZED,
                    data: null,
                    extensions: [],
                };
            }
            return {
                status: result_object_1.resultStatus.SUCCESS,
                data: null,
                extensions: [],
            };
        });
    }
    getMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersQueryRepository.findById(userId);
            if (!result)
                return null;
            return {
                login: result === null || result === void 0 ? void 0 : result.login,
                email: result === null || result === void 0 ? void 0 : result.email,
                userId: result === null || result === void 0 ? void 0 : result.id,
            };
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map