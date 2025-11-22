"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.postIdValidation = (0, express_validator_1.param)("postId")
  .trim()
  .notEmpty()
  .withMessage("PostId is required")
  .isString();
//# sourceMappingURL=postId-validation.middleware.js.map
