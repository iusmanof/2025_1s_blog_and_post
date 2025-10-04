"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../auth");
const titleValidation_1 = require("../bodyValidation/titleValidation");
const contentValidation_1 = require("../bodyValidation/contentValidation");
const shortDescriptionValidation_1 = require("../bodyValidation/shortDescriptionValidation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const PostHandler_1 = __importDefault(require("../handlers/PostHandler"));
exports.PostRouter = (0, express_1.Router)();
exports.PostRouter.get("/", PostHandler_1.default.GET);
exports.PostRouter.get("/:id", PostHandler_1.default.GET_ID);
exports.PostRouter.post("/", auth_1.basicAuth, [titleValidation_1.titleValidation, contentValidation_1.contentValidation, shortDescriptionValidation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, PostHandler_1.default.POST);
exports.PostRouter.put("/:id", auth_1.basicAuth, [titleValidation_1.titleValidation, contentValidation_1.contentValidation, shortDescriptionValidation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, PostHandler_1.default.PUT);
exports.PostRouter.delete("/:id", auth_1.basicAuth, PostHandler_1.default.DELETE);
