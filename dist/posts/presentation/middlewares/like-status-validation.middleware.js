"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeStatusValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const like_1 = require("../../../comments/types/like");
exports.likeStatusValidationMiddleware = (0, express_validator_1.body)("likeStatus")
    .isIn(Object.values(like_1.LikeStatus))
    .withMessage("Invalid likeStatus");
//# sourceMappingURL=like-status-validation.middleware.js.map