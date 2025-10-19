"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidationa = void 0;
const express_validator_1 = require("express-validator");
exports.commentValidationa = (0, express_validator_1.body)('content')
    .trim()
    .isString()
    .isLength({ min: 20, max: 300 })
    .withMessage('Length must be at least 3 characters long');
//# sourceMappingURL=comments-validation.middleware.js.map