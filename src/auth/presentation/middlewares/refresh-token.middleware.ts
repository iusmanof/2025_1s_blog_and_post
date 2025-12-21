import { container } from "../../../composition.root";
import { Request, Response, NextFunction, RequestHandler } from "express";
import httpStatusCode from "../../../core/types/http-status-code";
import { JwtAdapter } from "../../application/adapters/jwt.adapter";
const jwtAdapter = container.get(JwtAdapter);

export const checkRefreshTokenMiddleware: RequestHandler = async (
  req,
  res,
  next,
) => {
  const rftoken = req.cookies.refreshToken;

  if (!rftoken) {
    res
      .status(httpStatusCode.UNAUTHORIZED_401)
      .send({ errorsMessages: "Unauthorized" });
    return;
  } else {
    next();
  }
};

export const verifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const rftoken = req.cookies.refreshToken;
  if (!rftoken) {
    res
      .status(httpStatusCode.UNAUTHORIZED_401)
      .send({ errorsMessages: "No refresh token provided" });
    return;
  }

  const verifyToken = await jwtAdapter.verifyRefreshToken(rftoken);

  if (!verifyToken) {
    res
      .status(httpStatusCode.UNAUTHORIZED_401)
      .send({ errorsMessages: "Token is not verified or expired" });
    return;
  }
  next();
};
