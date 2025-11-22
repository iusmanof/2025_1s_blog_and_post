import { Router, Request, Response } from "express";
import httpStatusCode from "../../core/types/http-status-code";
import { resultStatus } from "../../core/types/result-object";
import { verifyRefreshToken } from "../middlewares/refresh-token.middleware";
import { userIdBelongsToAnotherMiddleware } from "../middlewares/user-id-belongs-to-another.middleware";
import { SecurityDevicesService } from "../services/security-devices.service";
import { container } from "../../composition.root";
const securityDevicesService = container.get(SecurityDevicesService);

export const securityDevicesRouter = Router();

securityDevicesRouter.get(
  "/",
  verifyRefreshToken,
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const devices = await securityDevicesService.getDevices(refreshToken);
    if (!devices) {
      res
        .sendStatus(httpStatusCode.UNAUTHORIZED_401)
        .json({ error: "Unauthorized" });
    }
    res.status(httpStatusCode.OK_200).send(devices);
  },
);

securityDevicesRouter.delete(
  "/",
  verifyRefreshToken,
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    await securityDevicesService.terminateAllSessionExcludeCurrent(
      refreshToken,
    );
    res
      .status(httpStatusCode.NO_CONTENT_204)
      .json({ message: "Delete all devices" });
  },
);

securityDevicesRouter.delete(
  "/:deviceId",
  verifyRefreshToken,
  userIdBelongsToAnotherMiddleware,
  async (req: Request, res: Response) => {
    const deviceId = req.params.deviceId;
    const result = await securityDevicesService.deleteById(deviceId);

    if (result.status === resultStatus.NOT_FOUND) {
      res
        .status(httpStatusCode.NOT_FOUND_404)
        .json({ errorsMessages: result.extensions });
      return;
    }
    res.status(httpStatusCode.NO_CONTENT_204).json({ test: "test" });
  },
);
