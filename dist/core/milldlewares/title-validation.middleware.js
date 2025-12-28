"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.titleValidationMiddleware = (0, express_validator_1.body)("title")
    .trim()
    .isString()
    .withMessage("Param not a string")
    .isLength({ min: 1, max: 30 })
    .withMessage("Param is too long");
//# sourceMappingURL=title-validation.middleware.js.map