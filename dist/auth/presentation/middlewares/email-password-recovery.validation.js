"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailPasswordRecoveryValidation = void 0;
const express_validator_1 = require("express-validator");
exports.emailPasswordRecoveryValidation = (0, express_validator_1.body)("email")
    .trim()
    .isEmail()
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    .withMessage("Email is not correct");
//# sourceMappingURL=email-password-recovery.validation.js.map