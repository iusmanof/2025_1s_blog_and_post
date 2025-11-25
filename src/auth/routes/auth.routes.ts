import { Router } from "express";
import { passwordValidation } from "../middlewares/password.validation-middleware";
import { inputValidationMiddleware } from "../../core/milldlewares/input-validation-middleware";
import { loginOrEmailValidation } from "../../core/milldlewares/login-or-email.validation";
import { accessTokenGuard } from "../access-token.guard";
import { inputRegistrationValidationMiddleware } from "../middlewares/input-registration-validation.middleware";
import { loginRegistrationValidationMiddleware } from "../middlewares/login-registration.validation.middleware";
import { emailRegistrationValidationMiddleware } from "../middlewares/email-registration-validation.middleware";
import {
  checkRefreshTokenMiddleware,
  verifyRefreshToken,
} from "../middlewares/refresh-token.middleware";
import { rateLimitMiddleware } from "../middlewares/rate-limit.middleware";
const loginRequestLimit = rateLimitMiddleware(5, 10);
const registrationRequestLimit = rateLimitMiddleware(5, 10);
const registrationEmailResendingRequestLimit = rateLimitMiddleware(5, 10);
const registrationNewPasswordRequestLimit = rateLimitMiddleware(5, 10);
const registrationConfirmationRequestLimit = rateLimitMiddleware(5, 10);
const recoveryPasswordRequestLimit = rateLimitMiddleware(5, 10);
import { container } from "../../composition.root";
import { AuthController } from "../controllers/auth.controller";
import {newPasswordValidation} from "../middlewares/new-password-validation.middleware";
import {emailPasswordRecoveryValidation} from "../middlewares/email-password-recovery.validation";

const authController = container.get(AuthController);

export const authRouter = Router();

authRouter.post(
  "/login",
  passwordValidation,
  loginOrEmailValidation,
  inputValidationMiddleware,
  loginRequestLimit,
  authController.login,
);

authRouter.get("/me", accessTokenGuard, authController.me);

authRouter.post(
  "/registration-confirmation",
  registrationConfirmationRequestLimit,
  authController.registrationConfirmation,
);

authRouter.post(
  "/registration",
  registrationRequestLimit,
  emailRegistrationValidationMiddleware,
  loginRegistrationValidationMiddleware,
  passwordValidation,
  inputRegistrationValidationMiddleware,
  authController.registration,
);

authRouter.post(
  "/registration-email-resending",
  registrationEmailResendingRequestLimit,
  authController.registrationEmailResending,
);

authRouter.post(
  "/refresh-token",
  verifyRefreshToken,
  authController.refreshToken,
);

authRouter.post("/password-recovery",
    emailPasswordRecoveryValidation,
    inputRegistrationValidationMiddleware,
    recoveryPasswordRequestLimit,
    authController.passwordRecovery
);

authRouter.post("/new-password",
    newPasswordValidation,
    inputRegistrationValidationMiddleware,
    registrationNewPasswordRequestLimit,
    authController.newPassword
);

authRouter.post(
  "/logout",
  checkRefreshTokenMiddleware,
  verifyRefreshToken,
  authController.logout,
);
