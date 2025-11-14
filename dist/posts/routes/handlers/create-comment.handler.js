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
exports.createCommentHandler = createCommentHandler;
const comments_service_1 = require("../../../comments/services/comments.service");
const result_object_1 = require("../../../core/types/result-object");
const http_status_code_1 = __importDefault(require("../../../core/types/http-status-code"));
const post_service_1 = __importDefault(require("../../services/post.service"));
function createCommentHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            res.status(http_status_code_1.default.UNAUTHORIZED_401).send("Unauthorized");
            return;
        }
        const userId = req.user.id;
        const postId = req.params.postId;
        const content = req.body.content;
        const post = yield post_service_1.default.findById(postId);
        if (!post) {
            res.status(http_status_code_1.default.NOT_FOUND_404).send("Post not found");
            return;
        }
        const result = yield comments_service_1.commentsService.create(userId, postId, content);
        if (result.status === result_object_1.resultStatus.ERROR) {
            res.status(http_status_code_1.default.BAD_REQUEST_400).json(result);
            return;
        }
        res.status(http_status_code_1.default.CREATED_201).json(result.data);
    });
}
//# sourceMappingURL=create-comment.handler.js.map