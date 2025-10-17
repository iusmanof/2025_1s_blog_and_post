"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginOrEmailValidation = void 0;
const express_validator_1 = require("express-validator");
exports.loginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail')
    .trim()
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage('Invalid email or login ');
//# sourceMappingURL=login-or-email.validation.js.map