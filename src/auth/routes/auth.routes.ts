import { Request, Response, Router } from "express";
import { passwordValidation } from "../../core/milldlewares/validation/password.validation-middleware";
import { inputValidationMiddleware } from "../../core/milldlewares/validation/input-validation-middleware";
import { loginOrEmailValidation } from "../../core/milldlewares/validation/login-or-email.validation";
import { LoginOrEmailDto } from "../types/login-or-email.dto";
import httpStatusCode from "../../core/types/http-status-code";
import { authService } from "../services/auth.service";
import { resultStatus } from "../../core/types/result-object";
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
const registrationConfirmationRequestLimit = rateLimitMiddleware(5, 10);

export const authRouter = Router();

authRouter.post(
  "/login",
  passwordValidation,
  loginOrEmailValidation,
  inputValidationMiddleware,
  loginRequestLimit,
  async (req: Request<{}, LoginOrEmailDto>, res: Response) => {
    const { loginOrEmail, password } = req.body;
    const ipAddr = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "unknown ip";
    const userAgent: string =
      req.headers["user-agent"] ?? "userAgent undefined";

    const result = await authService.login(
      loginOrEmail,
      password,
      ipAddr,
      userAgent,
    );

    if (result.status === resultStatus.ERROR || result.data === null) {
      res.status(httpStatusCode.UNAUTHORIZED_401).json(result);
      return;
    }
    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res
      .status(httpStatusCode.OK_200)
      .json({ accessToken: result.data.accessToken });
  },
);

authRouter.get("/me", accessTokenGuard, async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.sendStatus(httpStatusCode.UNAUTHORIZED_401);
    return;
  }

  const me = await authService.getMe(userId);
  if (!me) {
    res.sendStatus(httpStatusCode.UNAUTHORIZED_401);
    return;
  }

  res.status(httpStatusCode.OK_200).send(me);
});

authRouter.post(
  "/registration-confirmation",
  registrationConfirmationRequestLimit,
  async (req: Request<{}, {}, { code: string }>, res: Response) => {
    const code = req.body.code;

    const result = await authService.confirmUser(code);

    if (
      result.status === resultStatus.BAD_REQUEST ||
      result.status === resultStatus.CODE_EXPIRED
    ) {
      res
        .status(httpStatusCode.BAD_REQUEST_400)
        .json({ errorsMessages: result.extensions });
      return;
    }

    res.sendStatus(httpStatusCode.NO_CONTENT_204);
  },
);

authRouter.post(
  "/registration",
  registrationRequestLimit,
  emailRegistrationValidationMiddleware,
  loginRegistrationValidationMiddleware,
  passwordValidation,
  inputRegistrationValidationMiddleware,
  async (req: Request, res: Response) => {
    const { login, email, password } = req.body;

    const result = await authService.registerUser(login, email, password);
    if (result.status === resultStatus.EXISTS) {
      res
        .status(httpStatusCode.BAD_REQUEST_400)
        .json({ errorsMessages: result.extensions });
      return;
    }

    res.sendStatus(httpStatusCode.NO_CONTENT_204);
  },
);

authRouter.post(
  "/registration-email-resending",
  registrationEmailResendingRequestLimit,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const result = await authService.resendCode(email);
    if (
      result.status === resultStatus.BAD_REQUEST ||
      result.status === resultStatus.NOT_FOUND
    ) {
      res
        .status(httpStatusCode.BAD_REQUEST_400)
        .json({ errorsMessages: result.extensions });
      return;
    }
    res.status(httpStatusCode.NO_CONTENT_204).send("resend");
  },
);

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

authRouter.post(
  "/refresh-token",
  verifyRefreshToken,
  async (req: Request, res: Response) => {
    const rf = req.cookies.refreshToken;
    const ipAddr = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "unknown ip";
    const userAgent: string =
      req.headers["user-agent"] ?? "userAgent undefined";

    if (!rf) {
      res
        .status(httpStatusCode.UNAUTHORIZED_401)
        .json({ message: "Refresh token missing" });
      return;
    }

    const result = await authService.updateToken(rf, ipAddr, userAgent);

    if (result.status === resultStatus.UNAUTORIZED) {
      res.sendStatus(httpStatusCode.UNAUTHORIZED_401);
      return;
    }

    const { accessToken, refreshToken } = result.data as TokenPair;

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.status(httpStatusCode.OK_200).json({ accessToken: accessToken });
  },
);

authRouter.post(
  "/logout",
  checkRefreshTokenMiddleware,
  verifyRefreshToken,
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    const result = await authService.expireToken(token);
    if (result.status === resultStatus.UNAUTORIZED) {
      res.sendStatus(httpStatusCode.UNAUTHORIZED_401);
      return;
    }
    if (result.status === resultStatus.SUCCESS) {
      res.sendStatus(httpStatusCode.NO_CONTENT_204);
    }
  },
);
