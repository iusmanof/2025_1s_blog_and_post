"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryIdMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.queryIdMiddleware = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage("Invalid MongoId")
];
//# sourceMappingURL=query-id.middleware.js.map