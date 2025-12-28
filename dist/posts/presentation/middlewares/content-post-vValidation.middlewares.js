"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentPostValidation = void 0;
const express_validator_1 = require("express-validator");
exports.contentPostValidation = (0, express_validator_1.body)("content")
  .trim()
  .isString()
  .withMessage("Param not a string")
  .isLength({ min: 1, max: 1000 })
  .withMessage("Param is too long");
//# sourceMappingURL=content-post-vValidation.middlewares.js.map
