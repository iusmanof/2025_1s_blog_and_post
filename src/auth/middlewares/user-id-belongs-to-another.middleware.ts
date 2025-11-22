import { Request, Response, NextFunction, RequestHandler } from "express";
import httpStatusCode from "../../core/types/http-status-code";
import { container } from "../../composition.root";
import { JwtAdapter } from "../adapters/jwt.adapter";
import { SecurityDevicesQueryRepository } from "../repositories/security-devices.query-repository";

const jwtAdapter = container.get(JwtAdapter);
const securityDevicesQueryRepository = container.get(
  SecurityDevicesQueryRepository,
);

export const userIdBelongsToAnotherMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const rftoken = req.cookies.refreshToken;
  const targerDeviceId = req.params.deviceId;
  const { id: decodedUserId } = await jwtAdapter.decodeToken(rftoken);
  const targetDevice =
    await securityDevicesQueryRepository.geByDeviceId(targerDeviceId);

  if (!targetDevice) {
    res.status(httpStatusCode.NOT_FOUND_404).json({ test: "not found" });
    return;
  }

  if (targetDevice?.userId !== decodedUserId) {
    res.status(httpStatusCode.FORBIDDEN_403).send({ error: "Forbidden" });
    return;
  }

  next();
};
