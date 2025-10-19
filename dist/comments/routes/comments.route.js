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
const HttpStatusCode_1 = __importDefault(require("../../core/types/HttpStatusCode"));
const comments_service_1 = require("../services/comments.service");
exports.commentsRouter = (0, express_1.Router)();
exports.commentsRouter.put("/:commentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ json: "comments put" });
}));
exports.commentsRouter.delete("/:commentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ json: "comments delete" });
}));
exports.commentsRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const result = yield comments_service_1.commentsService.getCommentById(commentId);
    if (!result) {
        res.status(HttpStatusCode_1.default.NOT_FOUND_404).send("Not Found");
    }
    res.status(HttpStatusCode_1.default.OK_200).json(result.data);
}));
//# sourceMappingURL=comments.route.js.map