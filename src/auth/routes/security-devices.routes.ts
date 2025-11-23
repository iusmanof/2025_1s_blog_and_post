import { Router } from "express";
import { verifyRefreshToken } from "../middlewares/refresh-token.middleware";
import { userIdBelongsToAnotherMiddleware } from "../middlewares/user-id-belongs-to-another.middleware";
import { container } from "../../composition.root";
import { SecurityDeviceController } from "../controllers/security-devices.controller";

const securityDeviceController = container.get(SecurityDeviceController);

export const securityDevicesRouter = Router();

securityDevicesRouter.get(
  "/",
  verifyRefreshToken,
  securityDeviceController.getAllDevices,
);

securityDevicesRouter.delete(
  "/",
  verifyRefreshToken,
  securityDeviceController.deleteAllSessionExcludeCurrent,
);

securityDevicesRouter.delete(
  "/:deviceId",
  verifyRefreshToken,
  userIdBelongsToAnotherMiddleware,
  securityDeviceController.deleteById,
);
