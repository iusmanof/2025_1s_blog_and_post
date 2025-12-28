"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginOrEmailValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.loginOrEmailValidationMiddleware = (0, express_validator_1.body)("loginOrEmail")
    .trim()
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage("Invalid email or login ");
//# sourceMappingURL=login-or-email-validation.middleware.js.map