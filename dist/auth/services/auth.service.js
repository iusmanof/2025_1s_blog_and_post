"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.AuthService = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const crypto_1 = require("crypto");
const date_fns_1 = require("date-fns");
const result_object_1 = require("../../core/types/result-object");
const email_template_1 = require("../adapters/email.template");
const jwt_adapter_1 = require("../adapters/jwt.adapter");
const security_devices_service_1 = require("./security-devices.service");
const email_adapter_1 = require("../adapters/email.adapter");
const bcrypt_adapter_1 = require("../adapters/bcrypt.adapter");
const users_repository_1 = require("../../users/repositories/users.repository");
const security_devices_query_repository_1 = require("../repositories/security-devices.query-repository");
const security_devices_repository_1 = require("../repositories/security-devices.repository");
const users_query_repository_1 = require("../../users/repositories/users.query.repository");
let AuthService = class AuthService {
    constructor(jwtAdapter, emailAdapter, emailAdapterRecoveryPassword, emailAdapterYandex, bcryptAdapter, securityDevicesService, securityDevicesQueryRepository, securityDevicesRepository, usersQueryRepository, usersRepository) {
        this.jwtAdapter = jwtAdapter;
        this.emailAdapter = emailAdapter;
        this.emailAdapterRecoveryPassword = emailAdapterRecoveryPassword;
        this.emailAdapterYandex = emailAdapterYandex;
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
                passwordRecovery: null,
            };
            yield this.usersRepository.create(newUser);
            if (newUser.emailConfirmation) {
                try {
                    yield this.emailAdapter.nodemailer(email, email_template_1.emailTemplate.registrationEmail(newUser.emailConfirmation.confirmationCode));
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
            if (user.emailConfirmation.expirationDate < new Date()) {
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
            const user = yield this.usersRepository.findByEmail(email);
            if (!user) {
                return {
                    status: result_object_1.resultStatus.NOT_FOUND,
                    errorMessages: "Email not found",
                    extensions: [{ message: "Email not exists", field: "email" }],
                    data: null,
                };
            }
            if (user.emailConfirmation.isConfirmed) {
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
                yield this.emailAdapter.nodemailer(email, email_template_1.emailTemplate.registrationEmail(codeRefreshed));
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
                    status: result_object_1.resultStatus.UNAUTHORIZED,
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
                    status: result_object_1.resultStatus.UNAUTHORIZED,
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
                    status: result_object_1.resultStatus.UNAUTHORIZED,
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
                login: result.login,
                email: result.email,
                userId: result.id,
            };
        });
    }
    passwordRecovery(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkEmail = yield this.usersRepository.findByEmail(email);
            const recovery_code = (0, crypto_1.randomUUID)();
            if (checkEmail) {
                try {
                    yield this.emailAdapterYandex.nodemailer(email, email_template_1.emailTemplate.recoveryPasswordEmail(recovery_code));
                }
                catch (err) {
                    console.log("send email error", err);
                }
                yield this.usersRepository.setRecoveryCode(email, recovery_code);
                return recovery_code;
            }
            return null;
        });
    }
    confirmPasswordRecovery(newPassword, recoveryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findByRecoveryCode(recoveryCode);
            if (!user || !user.passwordRecovery)
                return false;
            if (user.passwordRecovery.expirationDate < new Date()) {
                return false;
            }
            const hashedPassword = yield this.bcryptAdapter.generateHash(newPassword);
            yield this.usersRepository.updatePasswordByRecoveryCode(recoveryCode, hashedPassword);
            return true;
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(jwt_adapter_1.JwtAdapter)),
    __param(1, (0, inversify_1.inject)(email_adapter_1.EmailAdapter)),
    __param(2, (0, inversify_1.inject)(email_adapter_1.EmailAdapterRecoveryPassword)),
    __param(3, (0, inversify_1.inject)(email_adapter_1.EmailAdapterYandex)),
    __param(4, (0, inversify_1.inject)(bcrypt_adapter_1.BcryptAdapter)),
    __param(5, (0, inversify_1.inject)(security_devices_service_1.SecurityDevicesService)),
    __param(6, (0, inversify_1.inject)(security_devices_query_repository_1.SecurityDevicesQueryRepository)),
    __param(7, (0, inversify_1.inject)(security_devices_repository_1.SecurityDevicesRepository)),
    __param(8, (0, inversify_1.inject)(users_query_repository_1.UsersQueryRepository)),
    __param(9, (0, inversify_1.inject)(users_repository_1.UsersRepository)),
    __metadata("design:paramtypes", [jwt_adapter_1.JwtAdapter,
        email_adapter_1.EmailAdapter,
        email_adapter_1.EmailAdapterRecoveryPassword,
        email_adapter_1.EmailAdapterYandex,
        bcrypt_adapter_1.BcryptAdapter,
        security_devices_service_1.SecurityDevicesService,
        security_devices_query_repository_1.SecurityDevicesQueryRepository,
        security_devices_repository_1.SecurityDevicesRepository,
        users_query_repository_1.UsersQueryRepository,
        users_repository_1.UsersRepository])
], AuthService);
//# sourceMappingURL=auth.service.js.map