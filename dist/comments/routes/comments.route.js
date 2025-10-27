"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const http_status_code_1 = __importDefault(require("../../core/types/http-status-code"));
const comments_service_1 = require("../services/comments.service");
const access_token_guard_1 = require("../../auth/access-token.guard");
const result_object_1 = require("../../core/types/result-object");
const comments_validation_middleware_1 = require("../../core/milldlewares/validation/comments-validation.middleware");
const input_validation_middleware_1 = require("../../core/milldlewares/validation/input-validation-middleware");
exports.commentsRouter = (0, express_1.Router)();
exports.commentsRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const result = yield comments_service_1.commentsService.getByCommentId(commentId);
    if (result.status === result_object_1.resultStatus.NOT_FOUND) {
        res.status(http_status_code_1.default.NOT_FOUND_404).send("Not Found");
        return;
    }
    res.status(http_status_code_1.default.OK_200).send(result.data);
}));
exports.commentsRouter.delete("/:id", access_token_guard_1.accessTokenGuard, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const userId = req.user.id;
    const comment = yield comments_service_1.commentsService.getCommentById(commentId, userId);
    if (comment.status == result_object_1.resultStatus.NOT_FOUND) {
        res.status(http_status_code_1.default.NOT_FOUND_404).send("Comment not found");
        return;
    }
    if (comment.status == result_object_1.resultStatus.ERROR) {
        res.status(http_status_code_1.default.FORBIDDEN_403).send("If try delete the comment that is not your own");
        return;
    }
    const result = yield comments_service_1.commentsService.deleteById(commentId);
    if (result.status === result_object_1.resultStatus.ERROR) {
        res.status(http_status_code_1.default.NOT_FOUND_404).send("Comment not found");
        return;
    }
    if (result.status === result_object_1.resultStatus.SUCCESS) {
        res.status(http_status_code_1.default.NO_CONTENT_204).send();
        return;
    }
}));
exports.commentsRouter.put("/:id", access_token_guard_1.accessTokenGuard, [comments_validation_middleware_1.commentValidationa], input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const content = req.body.content;
    const userId = req.user.id;
    const comment = yield comments_service_1.commentsService.getCommentById(commentId, userId);
    if (comment.status == result_object_1.resultStatus.NOT_FOUND) {
        res.status(http_status_code_1.default.NOT_FOUND_404).send("Comment not found");
        return;
    }
    if (comment.status == result_object_1.resultStatus.ERROR) {
        res.status(http_status_code_1.default.FORBIDDEN_403).send("If try delete the comment that is not your own");
        return;
    }
    const result = yield comments_service_1.commentsService.updateById(commentId, content);
    if (result.status === result_object_1.resultStatus.ERROR) {
        res.status(http_status_code_1.default.NOT_FOUND_404).send("Comment not updated");
    }
    if (result.status === result_object_1.resultStatus.SUCCESS) {
        res.status(http_status_code_1.default.NO_CONTENT_204).send("Updated successfully");
    }
}));
//# sourceMappingURL=comments.route.js.map