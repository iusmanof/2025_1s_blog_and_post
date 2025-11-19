"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidation = void 0;
const express_validator_1 = require("express-validator");
exports.passwordValidation = (0, express_validator_1.body)("password")
    .isString()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password is not correct");
//# sourceMappingURL=password.validation-middleware.js.map