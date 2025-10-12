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
exports.createPostHandler = createPostHandler;
const post_service_1 = __importDefault(require("../../application/post.service"));
const HttpStatusCode_1 = __importDefault(require("../../../core/types/HttpStatusCode"));
function createPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postCreated = yield post_service_1.default.create(req.body);
        const apiErrorMsg = [];
        if (!postCreated) {
            apiErrorMsg.push({ message: "ID Not found", field: "id" });
            yield res
                .status(HttpStatusCode_1.default.NOT_FOUND_404)
                .json({ errorsMessages: apiErrorMsg });
        }
        yield res.status(HttpStatusCode_1.default.CREATED_201).json(postCreated);
    });
}
//# sourceMappingURL=create-post.handler.js.map