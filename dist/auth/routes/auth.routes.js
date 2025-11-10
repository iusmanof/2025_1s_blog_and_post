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
exports.authRouter = void 0;
const express_1 = require("express");
const password_validation_middleware_1 = require("../../core/milldlewares/validation/password.validation-middleware");
const input_validation_middleware_1 = require("../../core/milldlewares/validation/input-validation-middleware");
const login_or_email_validation_1 = require("../../core/milldlewares/validation/login-or-email.validation");
const http_status_code_1 = __importDefault(require("../../core/types/http-status-code"));
const auth_service_1 = require("../services/auth.service");
const result_object_1 = require("../../core/types/result-object");
const access_token_guard_1 = require("../access-token.guard");
const input_registration_validation_middleware_1 = require("../middlewares/input-registration-validation.middleware");
const login_registration_validation_middleware_1 = require("../middlewares/login-registration.validation.middleware");
const email_registration_validation_middleware_1 = require("../middlewares/email-registration-validation.middleware");
const refresh_token_middleware_1 = require("../middlewares/refresh-token.middleware");
const rate_limit_middleware_1 = require("../middlewares/rate-limit.middleware");
const loginRequestLimit = (0, rate_limit_middleware_1.rateLimitMiddleware)(5, 10);
const registrationRequestLimit = (0, rate_limit_middleware_1.rateLimitMiddleware)(5, 10);
const registrationEmailResendingRequestLimit = (0, rate_limit_middleware_1.rateLimitMiddleware)(5, 10);
const registrationConfirmationRequestLimit = (0, rate_limit_middleware_1.rateLimitMiddleware)(5, 10);
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/login", password_validation_middleware_1.passwordValidation, login_or_email_validation_1.loginOrEmailValidation, input_validation_middleware_1.inputValidationMiddleware, loginRequestLimit, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { loginOrEmail, password } = req.body;
    const ipAddr = req.headers['x-forwarded-for']
        ? req.headers['x-forwarded-for'][0]
        : req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown ip';
    const userAgent = (_a = req.headers['user-agent']) !== null && _a !== void 0 ? _a : "userAgent undefined";
    // Create RT AT using  Login Password IP User-agent
    const result = yield auth_service_1.authService.login(loginOrEmail, password, ipAddr, userAgent);
    if (result.status === result_object_1.resultStatus.ERROR || result.data === null) {
        res.status(http_status_code_1.default.UNAUTHORIZED_401).json(result);
        return;
    }
    res.cookie('refreshToken', result.data.refreshToken, { httpOnly: true, secure: true });
    res.status(http_status_code_1.default.OK_200).json({ accessToken: result.data.accessToken });
}));
exports.authRouter.get("/me", access_token_guard_1.accessTokenGuard, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.sendStatus(http_status_code_1.default.UNAUTHORIZED_401);
        return;
    }
    const me = yield auth_service_1.authService.getMe(userId);
    if (!me) {
        res.sendStatus(http_status_code_1.default.UNAUTHORIZED_401);
        return;
    }
    res.status(http_status_code_1.default.OK_200).send(me);
}));
exports.authRouter.post("/registration-confirmation", registrationConfirmationRequestLimit, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.body.code;
    const result = yield auth_service_1.authService.confirmUser(code);
    if (result.status === result_object_1.resultStatus.BAD_REQUEST || result.status === result_object_1.resultStatus.CODE_EXPIRED) {
        res.status(http_status_code_1.default.BAD_REQUEST_400).json({ errorsMessages: result.extensions });
        return;
    }
    res.sendStatus(http_status_code_1.default.NO_CONTENT_204);
}));
exports.authRouter.post("/registration", registrationRequestLimit, email_registration_validation_middleware_1.emailRegistrationValidationMiddleware, login_registration_validation_middleware_1.loginRegistrationValidationMiddleware, password_validation_middleware_1.passwordValidation, input_registration_validation_middleware_1.inputRegistrationValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, email, password } = req.body;
    const result = yield auth_service_1.authService.registerUser(login, email, password);
    if (result.status === result_object_1.resultStatus.EXISTS) {
        res.status(http_status_code_1.default.BAD_REQUEST_400).json({ errorsMessages: result.extensions });
        return;
    }
    res.sendStatus(http_status_code_1.default.NO_CONTENT_204);
}));
exports.authRouter.post("/registration-email-resending", registrationEmailResendingRequestLimit, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.authService.resendCode(email);
    if (result.status === result_object_1.resultStatus.BAD_REQUEST || result.status === result_object_1.resultStatus.NOT_FOUND) {
        res.status(http_status_code_1.default.BAD_REQUEST_400).json({ errorsMessages: result.extensions });
        return;
    }
    res.status(http_status_code_1.default.NO_CONTENT_204).send('resend');
}));
exports.authRouter.post('/refresh-token', refresh_token_middleware_1.verifyRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const rf = req.cookies.refreshToken;
    const ipAddr = req.headers['x-forwarded-for']
        ? req.headers['x-forwarded-for'][0]
        : req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown ip';
    const userAgent = (_a = req.headers['user-agent']) !== null && _a !== void 0 ? _a : "userAgent undefined";
    if (!rf) {
        res.status(http_status_code_1.default.UNAUTHORIZED_401).json({ message: "Refresh token missing" });
        return;
    }
    const result = yield auth_service_1.authService.updateToken(rf, ipAddr, userAgent);
    if (result.status === result_object_1.resultStatus.UNAUTORIZED) {
        res.sendStatus(http_status_code_1.default.UNAUTHORIZED_401);
        return;
    }
    const { accessToken, refreshToken } = result.data;
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(http_status_code_1.default.OK_200).json({ accessToken: accessToken });
}));
exports.authRouter.post('/logout', refresh_token_middleware_1.checkRefreshTokenMiddleware, refresh_token_middleware_1.verifyRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshToken;
    const result = yield auth_service_1.authService.expireToken(token);
    if (result.status === result_object_1.resultStatus.UNAUTORIZED) {
        res.sendStatus(http_status_code_1.default.UNAUTHORIZED_401);
        return;
    }
    if (result.status === result_object_1.resultStatus.SUCCESS) {
        res.sendStatus(http_status_code_1.default.NO_CONTENT_204);
    }
}));
//# sourceMappingURL=auth.routes.js.map