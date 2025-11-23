import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { SecurityDevicesService } from "../services/security-devices.service";
import httpStatusCode from "../../core/types/http-status-code";
import { resultStatus } from "../../core/types/result-object";

@injectable()
export class SecurityDeviceController {
  constructor(
    @inject(SecurityDevicesService)
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

  getAllDevices = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const devices = await this.securityDevicesService.getDevices(refreshToken);
    if (!devices) {
      res
        .sendStatus(httpStatusCode.UNAUTHORIZED_401)
        .json({ error: "Unauthorized" });
    }
    res.status(httpStatusCode.OK_200).send(devices);
  };

  deleteAllSessionExcludeCurrent = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    await this.securityDevicesService.terminateAllSessionExcludeCurrent(
      refreshToken,
    );
    res
      .status(httpStatusCode.NO_CONTENT_204)
      .json({ message: "Delete all devices" });
  };

  deleteById = async (req: Request, res: Response) => {
    const deviceId = req.params.deviceId;
    const result = await this.securityDevicesService.deleteById(deviceId);

    if (result.status === resultStatus.NOT_FOUND) {
      res
        .status(httpStatusCode.NOT_FOUND_404)
        .json({ errorsMessages: result.extensions });
      return;
    }
    res.status(httpStatusCode.NO_CONTENT_204).json({ test: "test" });
  };
}
