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
exports.userIdBelongsToAnotherMiddleware = void 0;
const http_status_code_1 = __importDefault(
  require("../../core/types/http-status-code"),
);
const composition_root_1 = require("../../composition.root");
const jwt_adapter_1 = require("../adapters/jwt.adapter");
const security_devices_query_repository_1 = require("../infrastructure/security-devices.query-repository");
const jwtAdapter = composition_root_1.container.get(jwt_adapter_1.JwtAdapter);
const securityDevicesQueryRepository = composition_root_1.container.get(
  security_devices_query_repository_1.SecurityDevicesQueryRepository,
);
const userIdBelongsToAnotherMiddleware = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const rftoken = req.cookies.refreshToken;
    const targerDeviceId = req.params.deviceId;
    const { id: decodedUserId } = yield jwtAdapter.decodeToken(rftoken);
    const targetDevice =
      yield securityDevicesQueryRepository.geByDeviceId(targerDeviceId);
    if (!targetDevice) {
      res
        .status(http_status_code_1.default.NOT_FOUND_404)
        .json({ test: "not found" });
      return;
    }
    if (
      (targetDevice === null || targetDevice === void 0
        ? void 0
        : targetDevice.userId) !== decodedUserId
    ) {
      res
        .status(http_status_code_1.default.FORBIDDEN_403)
        .send({ error: "Forbidden" });
      return;
    }
    next();
  });
exports.userIdBelongsToAnotherMiddleware = userIdBelongsToAnotherMiddleware;
//# sourceMappingURL=user-id-belongs-to-another.middleware.js.map
