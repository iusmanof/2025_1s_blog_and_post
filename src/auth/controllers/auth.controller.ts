import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginOrEmailDto } from "../types/login-or-email.dto";
import { resultStatus } from "../../core/types/result-object";
import httpStatusCode from "../../core/types/http-status-code";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  login = async (req: Request<{}, {}, LoginOrEmailDto>, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const ipAddr = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "unknown ip";

    const userAgent = req.headers["user-agent"] ?? "userAgent undefined";

    const result = await this.authService.login(
      loginOrEmail,
      password,
      ipAddr,
      userAgent,
    );

    if (result.status === resultStatus.ERROR || result.data === null) {
      return res.status(httpStatusCode.UNAUTHORIZED_401).json(result);
    }

    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.status(httpStatusCode.OK_200).json({
      accessToken: result.data.accessToken,
    });
  };

  me = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.sendStatus(httpStatusCode.UNAUTHORIZED_401);
      return;
    }

    const me = await this.authService.getMe(userId);
    if (!me) {
      res.sendStatus(httpStatusCode.UNAUTHORIZED_401);
      return;
    }

    res.status(httpStatusCode.OK_200).send(me);
  };

  registrationConfirmation = async (
    req: Request<{}, {}, { code: string }>,
    res: Response,
  ) => {
    const code = req.body.code;

    const result = await this.authService.confirmUser(code);

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
  };

  registration = async (req: Request, res: Response) => {
    const { login, email, password } = req.body;

    const result = await this.authService.registerUser(login, email, password);
    if (result.status === resultStatus.EXISTS) {
      res
        .status(httpStatusCode.BAD_REQUEST_400)
        .json({ errorsMessages: result.extensions });
      return;
    }

    res.sendStatus(httpStatusCode.NO_CONTENT_204);
  };

  registrationEmailResending = async (req: Request, res: Response) => {
    const { email } = req.body;

    const result = await this.authService.resendCode(email);
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
  };

  refreshToken = async (req: Request, res: Response) => {
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

    const result = await this.authService.updateToken(rf, ipAddr, userAgent);

    if (result.status === resultStatus.UNAUTHORIZED) {
      res.sendStatus(httpStatusCode.UNAUTHORIZED_401);
      return;
    }

    const { accessToken, refreshToken } = result.data as TokenPair;

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.status(httpStatusCode.OK_200).json({ accessToken: accessToken });
  };

  passwordRecovery = async (
    req: Request<{}, {}, { email: string }>,
    res: Response,
  ) => {
    await this.authService.passwordRecovery(req.body.email);

    res.status(httpStatusCode.NO_CONTENT_204).send("recovery password");
  };

  newPassword = async (req: Request, res: Response) => {
    const success = await this.authService.confirmPasswordRecovery(
      req.body.newPassword,
      req.body.recoveryCode,
    );

    if (!success) {
      res.status(httpStatusCode.BAD_REQUEST_400).json({
        errorsMessages: [
          { message: "Invalid recovery code", field: "recoveryCode" },
        ],
      });
      return;
    }

    res.status(httpStatusCode.NO_CONTENT_204).send("new password");
  };

  logout = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    const result = await this.authService.expireToken(token);
    if (result.status === resultStatus.UNAUTHORIZED) {
      res.sendStatus(httpStatusCode.UNAUTHORIZED_401);
      return;
    }
    if (result.status === resultStatus.SUCCESS) {
      res.sendStatus(httpStatusCode.NO_CONTENT_204);
    }
  };
}
