"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortDescriptionValidation = void 0;
const express_validator_1 = require("express-validator");
exports.shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .trim()
    .isString().withMessage('Param not a string')
    .isLength({ min: 1, max: 100 }).withMessage('Param is too long');
