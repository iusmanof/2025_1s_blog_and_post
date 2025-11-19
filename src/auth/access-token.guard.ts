import { NextFunction, Request, Response } from "express";
import httpStatusCode from "../core/types/http-status-code";
import {jwtAdapter} from "../composition.root";

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    res.status(httpStatusCode.UNAUTHORIZED_401).send("Unauthorized");
    return;
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    res.status(httpStatusCode.UNAUTHORIZED_401).send("Unauthorized");
    return;
  }

  try {
    const payload = await jwtAdapter.verifyAccessToken(token);
    if (!payload || typeof payload === "string" || !("id" in payload)) {
      res.status(httpStatusCode.UNAUTHORIZED_401).send("Unauthorized");
      return;
    }

    const decodedToken = await jwtAdapter.decodeToken(token);
    if (
      !decodedToken ||
      (decodedToken.exp && decodedToken.exp * 1000 <= Date.now())
    ) {
      res.status(httpStatusCode.UNAUTHORIZED_401).send("AT expired");
      return;
    }

    req.user = { id: payload.id };
    next();
  } catch (e) {
    res.status(httpStatusCode.UNAUTHORIZED_401).send("Token expired");
    return;
  }
};
