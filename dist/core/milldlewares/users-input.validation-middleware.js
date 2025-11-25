"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersInputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const http_status_code_1 = __importDefault(require("../types/http-status-code"));
const usersInputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true }).map((err) => {
            return {
                message: err.msg,
                field: "path" in err ? err.path : err.type,
            };
        });
        res
            .status(http_status_code_1.default.BAD_REQUEST_400)
            .send({ errorsMessages: errorsArray });
        return;
    }
    next();
};
exports.usersInputValidationMiddleware = usersInputValidationMiddleware;
//# sourceMappingURL=users-input.validation-middleware.js.map