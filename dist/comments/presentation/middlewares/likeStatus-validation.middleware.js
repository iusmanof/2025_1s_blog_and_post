"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeStatusValidation = void 0;
const express_validator_1 = require("express-validator");
const like_1 = require("../../types/like");
exports.likeStatusValidation = (0, express_validator_1.body)("likeStatus")
    .isString()
    .custom((v) => Object.values(like_1.LikeStatus).includes(v))
    .withMessage(`likeStatus must be one of: ${Object.values(like_1.LikeStatus).join(", ")}`);
//# sourceMappingURL=likeStatus-validation.middleware.js.map