"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = require("express");
const super_admin_guard_middleware_1 = require("../auth/middlewares/super-admin.guard-middleware");
const titleValidation_1 = require("../core/milldlewares/validation/titleValidation");
const contentValidation_1 = require("../core/milldlewares/validation/contentValidation");
const shortDescriptionValidation_1 = require("../core/milldlewares/validation/shortDescriptionValidation");
const input_validation_middleware_1 = require("../core/milldlewares/validation/input-validation-middleware");
const PostHandler_1 = __importDefault(require("../handlers/PostHandler"));
const blogsQueryValidation_1 = require("../core/milldlewares/validation/blogsQueryValidation");
exports.PostRouter = (0, express_1.Router)();
exports.PostRouter.get("/", (0, blogsQueryValidation_1.paginationAndSortingValidation)(), PostHandler_1.default.GET);
exports.PostRouter.get("/:id", PostHandler_1.default.GET_ID);
exports.PostRouter.post("/", super_admin_guard_middleware_1.basicAuth, [titleValidation_1.titleValidation, contentValidation_1.contentValidation, shortDescriptionValidation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, PostHandler_1.default.POST);
exports.PostRouter.put("/:id", super_admin_guard_middleware_1.basicAuth, [titleValidation_1.titleValidation, contentValidation_1.contentValidation, shortDescriptionValidation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, PostHandler_1.default.PUT);
exports.PostRouter.delete("/:id", super_admin_guard_middleware_1.basicAuth, PostHandler_1.default.DELETE);
//# sourceMappingURL=post.route.js.map