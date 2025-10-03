"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websiteValidation = void 0;
const express_validator_1 = require("express-validator");
exports.websiteValidation = (0, express_validator_1.body)('websiteUrl')
    .isURL().withMessage('URL must be a valid URL');
