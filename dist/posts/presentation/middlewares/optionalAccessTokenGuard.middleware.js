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
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAccessTokenGuard = void 0;
const composition_root_1 = require("../../../composition.root");
const jwt_adapter_1 = require("../../../auth/application/adapters/jwt.adapter");
const jwtAdapter = composition_root_1.container.get(jwt_adapter_1.JwtAdapter);
const optionalAccessTokenGuard = (req, _res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (
      !(authHeader === null || authHeader === void 0
        ? void 0
        : authHeader.startsWith("Bearer "))
    ) {
      return next();
    }
    const token = authHeader.split(" ")[1];
    const payload = yield jwtAdapter.verifyAccessToken(token);
    if (payload === null || payload === void 0 ? void 0 : payload.id) {
      req.user = { id: payload.id };
    }
    next();
  });
exports.optionalAccessTokenGuard = optionalAccessTokenGuard;
//# sourceMappingURL=optionalAccessTokenGuard.middleware.js.map
