"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputBlogsValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputBlogsValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true }).map((err) => ({
            message: err.msg,
            field: "path" in err ? err.path : err.type,
        }));
        res.status(400).send({ errorsMessages: errorsArray });
    }
    else {
        next();
    }
};
exports.inputBlogsValidationMiddleware = inputBlogsValidationMiddleware;
//# sourceMappingURL=input-blogs-validation.middleware.js.map