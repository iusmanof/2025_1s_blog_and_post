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
exports.getPostByIdHandler = getPostByIdHandler;
const post_service_1 = __importDefault(require("../../services/post.service"));
const HttpStatusCode_1 = __importDefault(require("../../../core/types/HttpStatusCode"));
function getPostByIdHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postFounded = yield post_service_1.default.findById(req.params.id);
        if (!postFounded) {
            res.status(HttpStatusCode_1.default.NOT_FOUND_404).send("No posts found.");
            return;
        }
        res.status(200).json(postFounded);
    });
}
//# sourceMappingURL=get-post-by-id.handler.js.map