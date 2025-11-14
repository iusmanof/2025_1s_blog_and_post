"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityDevicesRouter = void 0;
const express_1 = require("express");
const http_status_code_1 = __importDefault(
  require("../../core/types/http-status-code"),
);
const security_devices_service_1 = require("../services/security-devices.service");
exports.securityDevicesRouter = (0, express_1.Router)();
exports.securityDevicesRouter.get("/", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const devices =
      security_devices_service_1.securityDevicesService.getDevices();
    if (!devices) {
      res
        .sendStatus(http_status_code_1.default.UNAUTHORIZED_401)
        .json({ error: "Unauthorized" });
    }
    res.send(http_status_code_1.default.OK_200).json({ Hello: "world" });
  }),
);
exports.securityDevicesRouter.delete("/", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    res
      .status(http_status_code_1.default.NO_CONTENT_204)
      .json({ test: "test" });
  }),
);
exports.securityDevicesRouter.delete("/:deviceId", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    res
      .status(http_status_code_1.default.NO_CONTENT_204)
      .json({ test: "test" });
  }),
);
//# sourceMappingURL=security-devices.routes.js.map
