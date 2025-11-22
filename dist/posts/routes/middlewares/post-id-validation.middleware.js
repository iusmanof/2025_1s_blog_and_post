"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.postIdValidationMiddleware = postIdValidationMiddleware;
const http_status_code_1 = __importDefault(
  require("../../../core/types/http-status-code"),
);
function postIdValidationMiddleware(req, res, next) {
  const postId = req.params.postId;
  if (!postId) {
    res
      .status(http_status_code_1.default.NOT_FOUND_404)
      .send("postId not found");
    return;
  }
  next();
}
//# sourceMappingURL=post-id-validation.middleware.js.map
