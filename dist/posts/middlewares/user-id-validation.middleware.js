"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdValidationMiddleware = userIdValidationMiddleware;
function userIdValidationMiddleware(req, res, next) {
  if (!req.user || !req.user.id) {
    res.status(401).send("Unauthorized");
    return;
  }
  next();
}
//# sourceMappingURL=user-id-validation.middleware.js.map
