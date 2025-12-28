import { NextFunction, Request, Response } from "express";
import { container } from "../../../composition.root";
import { JwtAdapter } from "../../../auth/application/adapters/jwt.adapter";

const jwtAdapter = container.get(JwtAdapter);

export interface AccessTokenPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export const optionalAccessTokenGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  const payload = (await jwtAdapter.verifyAccessToken(
    token,
  )) as AccessTokenPayload | null;

  if (payload?.id) {
    req.user = { id: payload.id };
  }

  next();
};
