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
exports.getCommentsByPostIdHandler = getCommentsByPostIdHandler;
const comments_service_1 = require("../../../comments/services/comments.service");
const HttpStatusCode_1 = __importDefault(require("../../../core/types/HttpStatusCode"));
const HttpStatusCode_2 = __importDefault(require("../../../core/types/HttpStatusCode"));
function getCommentsByPostIdHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = req.params.postId;
        const query = req.query;
        const result = yield comments_service_1.commentsService.getCommentByPostId(postId, query);
        if (!result) {
            res.status(HttpStatusCode_2.default.NOT_FOUND_404).send("Not found");
        }
        res.status(HttpStatusCode_1.default.OK_200).json(result.data);
    });
}
//# sourceMappingURL=get-comment.handler.js.map