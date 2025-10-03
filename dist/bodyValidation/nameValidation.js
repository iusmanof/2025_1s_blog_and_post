"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameValidation = void 0;
const express_validator_1 = require("express-validator");
exports.nameValidation = (0, express_validator_1.body)('name')
    .trim()
    .isString().withMessage('Name must be string')
    .isLength({ min: 1, max: 15 }).withMessage('Name max length 15');
