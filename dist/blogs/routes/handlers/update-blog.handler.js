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
exports.updateBlogHandler = updateBlogHandler;
const blog_service_1 = __importDefault(require("../../services/blog.service"));
const HttpStatusCode_1 = __importDefault(require("../../../core/types/HttpStatusCode"));
function updateBlogHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const blogIsUpdated = yield blog_service_1.default.update(req.params.id, req.body);
        const apiErrorMsg = [];
        if (!blogIsUpdated) {
            apiErrorMsg.push({ message: "ID Not found", field: "id" });
            return yield res
                .status(HttpStatusCode_1.default.NOT_FOUND_404)
                .json({ errorsMessages: apiErrorMsg });
        }
        return yield res.status(HttpStatusCode_1.default.NO_CONTENT_204).send();
    });
}
//# sourceMappingURL=update-blog.handler.js.map