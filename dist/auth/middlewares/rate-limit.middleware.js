"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = void 0;
const http_status_code_1 = __importDefault(
  require("../../core/types/http-status-code"),
);
const rateLimits = {};
const startCount = 1;
const rateLimitMiddleware = (limitRequest, timeRequest) => {
  return (req, res, next) => {
    const url = req.url;
    const nowTime = Date.now();
    let record = rateLimits[url];
    if (!record) {
      rateLimits[url] = { countLimit: startCount, firstRequestTime: nowTime };
      next();
      return;
    }
    if (nowTime - record.firstRequestTime > timeRequest * 1000) {
      rateLimits[url] = { countLimit: startCount, firstRequestTime: nowTime };
      next();
      return;
    }
    if (record.countLimit >= limitRequest) {
      res
        .status(http_status_code_1.default.TOO_MANY_REQUESTS_429)
        .json({ message: "Rate limit reached" });
      return;
    }
    record.countLimit += 1;
    next();
  };
};
exports.rateLimitMiddleware = rateLimitMiddleware;
//# sourceMappingURL=rate-limit.middleware.js.map
