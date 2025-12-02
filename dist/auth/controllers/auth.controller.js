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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const auth_service_1 = require("../services/auth.service");
const result_object_1 = require("../../core/types/result-object");
const http_status_code_1 = __importDefault(require("../../core/types/http-status-code"));
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { loginOrEmail, password } = req.body;
            const ipAddr = req.headers["x-forwarded-for"]
                ? req.headers["x-forwarded-for"][0]
                : req.headers["x-forwarded-for"] ||
                    req.socket.remoteAddress ||
                    "unknown ip";
            const userAgent = (_a = req.headers["user-agent"]) !== null && _a !== void 0 ? _a : "userAgent undefined";
            const result = yield this.authService.login(loginOrEmail, password, ipAddr, userAgent);
            if (result.status === result_object_1.resultStatus.ERROR || result.data === null) {
                return res.status(http_status_code_1.default.UNAUTHORIZED_401).json(result);
            }
            res.cookie("refreshToken", result.data.refreshToken, {
                httpOnly: true,
                secure: true,
            });
            return res.status(http_status_code_1.default.OK_200).json({
                accessToken: result.data.accessToken,
            });
        });
        this.me = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.sendStatus(http_status_code_1.default.UNAUTHORIZED_401);
                return;
            }
            const me = yield this.authService.getMe(userId);
            if (!me) {
                res.sendStatus(http_status_code_1.default.UNAUTHORIZED_401);
                return;
            }
            res.status(http_status_code_1.default.OK_200).send(me);
        });
        this.registrationConfirmation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const code = req.body.code;
            const result = yield this.authService.confirmUser(code);
            if (result.status === result_object_1.resultStatus.BAD_REQUEST ||
                result.status === result_object_1.resultStatus.CODE_EXPIRED) {
                res
                    .status(http_status_code_1.default.BAD_REQUEST_400)
                    .json({ errorsMessages: result.extensions });
                return;
            }
            res.sendStatus(http_status_code_1.default.NO_CONTENT_204);
        });
        this.registration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { login, email, password } = req.body;
            const result = yield this.authService.registerUser(login, email, password);
            if (result.status === result_object_1.resultStatus.EXISTS) {
                res
                    .status(http_status_code_1.default.BAD_REQUEST_400)
                    .json({ errorsMessages: result.extensions });
                return;
            }
            res.sendStatus(http_status_code_1.default.NO_CONTENT_204);
        });
        this.registrationEmailResending = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const result = yield this.authService.resendCode(email);
            if (result.status === result_object_1.resultStatus.BAD_REQUEST ||
                result.status === result_object_1.resultStatus.NOT_FOUND) {
                res
                    .status(http_status_code_1.default.BAD_REQUEST_400)
                    .json({ errorsMessages: result.extensions });
                return;
            }
            res.status(http_status_code_1.default.NO_CONTENT_204).send("resend");
        });
        this.refreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const rf = req.cookies.refreshToken;
            const ipAddr = req.headers["x-forwarded-for"]
                ? req.headers["x-forwarded-for"][0]
                : req.headers["x-forwarded-for"] ||
                    req.socket.remoteAddress ||
                    "unknown ip";
            const userAgent = (_a = req.headers["user-agent"]) !== null && _a !== void 0 ? _a : "userAgent undefined";
            if (!rf) {
                res
                    .status(http_status_code_1.default.UNAUTHORIZED_401)
                    .json({ message: "Refresh token missing" });
                return;
            }
            const result = yield this.authService.updateToken(rf, ipAddr, userAgent);
            if (result.status === result_object_1.resultStatus.UNAUTHORIZED) {
                res.sendStatus(http_status_code_1.default.UNAUTHORIZED_401);
                return;
            }
            const { accessToken, refreshToken } = result.data;
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
            res.status(http_status_code_1.default.OK_200).json({ accessToken: accessToken });
        });
        this.passwordRecovery = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.authService.passwordRecovery(req.body.email);
            res.status(http_status_code_1.default.NO_CONTENT_204).send("recovery password");
        });
        this.newPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const success = yield this.authService.confirmPasswordRecovery(req.body.newPassword, req.body.recoveryCode);
            if (!success) {
                res.status(http_status_code_1.default.BAD_REQUEST_400).json({
                    errorsMessages: [
                        { message: "Invalid recovery code", field: "recoveryCode" },
                    ],
                });
                return;
            }
            res.status(http_status_code_1.default.NO_CONTENT_204).send("new password");
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.refreshToken;
            const result = yield this.authService.expireToken(token);
            if (result.status === result_object_1.resultStatus.UNAUTHORIZED) {
                res.sendStatus(http_status_code_1.default.UNAUTHORIZED_401);
                return;
            }
            if (result.status === result_object_1.resultStatus.SUCCESS) {
                res.sendStatus(http_status_code_1.default.NO_CONTENT_204);
            }
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map