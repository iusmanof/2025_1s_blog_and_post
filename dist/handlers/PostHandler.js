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
const PostService_1 = __importDefault(require("../services/PostService"));
const PostHandler = {
    GET: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield PostService_1.default.findMany();
        return res.status(HttpStatusCode_1.default.OK_200).send(result);
    }),
    GET_ID: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postFounded = yield PostService_1.default.findById(req.params.id);
        if (!postFounded)
            yield res.status(HttpStatusCode_1.default.NOT_FOUND_404).send("No posts found.");
        yield res.status(200).json(postFounded);
    }),
    POST: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postCreated = yield PostService_1.default.create(req.body);
        const apiErrorMsg = [];
        if (!postCreated) {
            apiErrorMsg.push({ message: "ID Not found", field: "id" });
            yield res
                .status(HttpStatusCode_1.default.NOT_FOUND_404)
                .json({ errorsMessages: apiErrorMsg });
        }
        yield res.status(HttpStatusCode_1.default.CREATED_201).json(postCreated);
    }),
    PUT: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postIsUpdated = yield PostService_1.default.update(req.params.id, req.body);
        const apiErrorMsg = [];
        if (!postIsUpdated) {
            apiErrorMsg.push({ message: "ID Not found", field: "id" });
            return yield res
                .status(HttpStatusCode_1.default.NOT_FOUND_404)
                .json({ errorsMessages: apiErrorMsg });
        }
        return yield res.status(HttpStatusCode_1.default.NO_CONTENT_204).send();
    }),
    DELETE: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const post = yield PostService_1.default.delete(req.params.id);
        if (!post)
            yield res.status(HttpStatusCode_1.default.NOT_FOUND_404).send("Not found");
        yield res.status(HttpStatusCode_1.default.NO_CONTENT_204).send();
    }),
};
exports.default = PostHandler;
