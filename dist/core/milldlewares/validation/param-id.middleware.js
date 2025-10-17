"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramIdMiddleware = void 0;
const mongodb_1 = require("mongodb");
const paramIdMiddleware = (req, res, next) => {
    const { blogId } = req.params;
    if (!blogId || !mongodb_1.ObjectId.isValid(blogId)) {
        return res.status(404).json({
            errors: [
                {
                    message: "Invalid blogId",
                    field: "blogId"
                }
            ]
        });
    }
    return next();
};
exports.paramIdMiddleware = paramIdMiddleware;
//# sourceMappingURL=param-id.middleware.js.map