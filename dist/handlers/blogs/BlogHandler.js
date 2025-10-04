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
const blog_data_access_layer_mongodb_1 = require("../../dataAccessLayer/blog-data-access-layer-mongodb");
const HttpStatusCode_1 = __importDefault(require("../../HTTP_STATUS_enum/HttpStatusCode"));
const BlogHandler = {
    GET: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blogAll = yield blog_data_access_layer_mongodb_1.blogDataAccessLayerMongoDB.getAllBlogs();
        return yield res.status(HttpStatusCode_1.default.OK_200).send(blogAll);
    })
};
exports.default = BlogHandler;
