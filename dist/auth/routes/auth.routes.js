"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const password_validation_middleware_1 = require("../middlewares/password.validation-middleware");
const input_validation_middleware_1 = require("../../core/milldlewares/input-validation-middleware");
const login_or_email_validation_1 = require("../../core/milldlewares/login-or-email.validation");
const access_token_guard_1 = require("../access-token.guard");
const input_registration_validation_middleware_1 = require("../middlewares/input-registration-validation.middleware");
const login_registration_validation_middleware_1 = require("../middlewares/login-registration.validation.middleware");
const email_registration_validation_middleware_1 = require("../middlewares/email-registration-validation.middleware");
const refresh_token_middleware_1 = require("../middlewares/refresh-token.middleware");
const rate_limit_middleware_1 = require("../middlewares/rate-limit.middleware");
const loginRequestLimit = (0, rate_limit_middleware_1.rateLimitMiddleware)(
  5,
  10,
);
const registrationRequestLimit = (0,
rate_limit_middleware_1.rateLimitMiddleware)(5, 10);
const registrationEmailResendingRequestLimit = (0,
rate_limit_middleware_1.rateLimitMiddleware)(5, 10);
const registrationNewPasswordRequestLimit = (0,
rate_limit_middleware_1.rateLimitMiddleware)(5, 10);
const registrationConfirmationRequestLimit = (0,
rate_limit_middleware_1.rateLimitMiddleware)(5, 10);
const recoveryPasswordRequestLimit = (0,
rate_limit_middleware_1.rateLimitMiddleware)(5, 10);
const composition_root_1 = require("../../composition.root");
const auth_controller_1 = require("../controllers/auth.controller");
const new_password_validation_middleware_1 = require("../middlewares/new-password-validation.middleware");
const email_password_recovery_validation_1 = require("../middlewares/email-password-recovery.validation");
const authController = composition_root_1.container.get(
  auth_controller_1.AuthController,
);
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post(
  "/login",
  password_validation_middleware_1.passwordValidation,
  login_or_email_validation_1.loginOrEmailValidation,
  input_validation_middleware_1.inputValidationMiddleware,
  loginRequestLimit,
  authController.login,
);
exports.authRouter.get(
  "/me",
  access_token_guard_1.accessTokenGuard,
  authController.me,
);
exports.authRouter.post(
  "/registration-confirmation",
  registrationConfirmationRequestLimit,
  authController.registrationConfirmation,
);
exports.authRouter.post(
  "/registration",
  registrationRequestLimit,
  email_registration_validation_middleware_1.emailRegistrationValidationMiddleware,
  login_registration_validation_middleware_1.loginRegistrationValidationMiddleware,
  password_validation_middleware_1.passwordValidation,
  input_registration_validation_middleware_1.inputRegistrationValidationMiddleware,
  authController.registration,
);
exports.authRouter.post(
  "/registration-email-resending",
  registrationEmailResendingRequestLimit,
  authController.registrationEmailResending,
);
exports.authRouter.post(
  "/refresh-token",
  refresh_token_middleware_1.verifyRefreshToken,
  authController.refreshToken,
);
exports.authRouter.post(
  "/password-recovery",
  email_password_recovery_validation_1.emailPasswordRecoveryValidation,
  input_registration_validation_middleware_1.inputRegistrationValidationMiddleware,
  recoveryPasswordRequestLimit,
  authController.passwordRecovery,
);
exports.authRouter.post(
  "/new-password",
  new_password_validation_middleware_1.newPasswordValidation,
  input_registration_validation_middleware_1.inputRegistrationValidationMiddleware,
  registrationNewPasswordRequestLimit,
  authController.newPassword,
);
exports.authRouter.post(
  "/logout",
  refresh_token_middleware_1.checkRefreshTokenMiddleware,
  refresh_token_middleware_1.verifyRefreshToken,
  authController.logout,
);
//# sourceMappingURL=auth.routes.js.map
