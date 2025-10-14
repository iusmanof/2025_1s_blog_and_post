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
exports.createBlogHandler = createBlogHandler;
const blog_service_1 = __importDefault(require("../../services/blog.service"));
const HttpStatusCode_1 = __importDefault(require("../../../core/types/HttpStatusCode"));
function createBlogHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const blogCreated = yield blog_service_1.default.create(req.body);
        return yield res.status(HttpStatusCode_1.default.CREATED_201).json(blogCreated);
    });
}
//# sourceMappingURL=create-blog.handler.js.map