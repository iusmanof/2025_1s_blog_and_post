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
const HttpStatusCode_1 = __importDefault(require("../HTTP_STATUS_enum/HttpStatusCode"));
const BlogService_1 = __importDefault(require("../services/BlogService"));
const BlogService_2 = __importDefault(require("../services/BlogService"));
const BlogHandler = {
    GET: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blogs = yield BlogService_1.default.findMany();
        return yield res.status(HttpStatusCode_1.default.OK_200).send(blogs);
    }),
    GET_ID: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield BlogService_2.default.findById(req.params.id);
        if (!blog)
            res.status(HttpStatusCode_1.default.NOT_FOUND_404).send("Blog not found.");
        res.status(200).json(blog);
    }),
    POST: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blogCreated = yield BlogService_2.default.create(req.body);
        return yield res.status(HttpStatusCode_1.default.CREATED_201).json(blogCreated);
    }),
    PUT: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blogIsUpdated = yield BlogService_2.default.update(req.params.id, req.body);
        const apiErrorMsg = [];
        if (!blogIsUpdated) {
            apiErrorMsg.push({ message: "ID Not found", field: "id" });
            return yield res
                .status(HttpStatusCode_1.default.NOT_FOUND_404)
                .json({ errorsMessages: apiErrorMsg });
        }
        return yield res.status(HttpStatusCode_1.default.NO_CONTENT_204).send();
    }),
    DELETE: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield BlogService_2.default.delete(req.params.id);
        if (!blog)
            return yield res.status(HttpStatusCode_1.default.NOT_FOUND_404).send("Not found");
        return yield res.status(HttpStatusCode_1.default.NO_CONTENT_204).send();
    }),
};
exports.default = BlogHandler;
