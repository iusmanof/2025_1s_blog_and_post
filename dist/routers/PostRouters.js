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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = require("express");
const StatusCode_1 = require("../StatusCode");
const auth_1 = require("../auth");
const titleValidation_1 = require("../bodyValidation/titleValidation");
const contentValidation_1 = require("../bodyValidation/contentValidation");
const shortDescriptionValidation_1 = require("../bodyValidation/shortDescriptionValidation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const post_data_access_layer_mongodb_1 = require("../dataAccessLayer/post-data-access-layer-mongodb");
exports.PostRouter = (0, express_1.Router)();
exports.PostRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_data_access_layer_mongodb_1.postAccessLayerMongoDB.getAllPosts();
    yield res.status(StatusCode_1.HTTP_STATUS.OK_200).send(result);
}));
exports.PostRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postFounded = yield post_data_access_layer_mongodb_1.postAccessLayerMongoDB.getPostById(req.params.id);
    if (!postFounded)
        yield res.status(StatusCode_1.HTTP_STATUS.NOT_FOUND_404).send("No posts found.");
    yield res.status(200).json(postFounded);
}));
exports.PostRouter.post('/', auth_1.basicAuth, [titleValidation_1.titleValidation, contentValidation_1.contentValidation, shortDescriptionValidation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postCreated = yield post_data_access_layer_mongodb_1.postAccessLayerMongoDB.createPost(req.body);
    const apiErrorMsg = [];
    if (!postCreated) {
        apiErrorMsg.push({ message: "ID Not found", field: "id" });
        yield res.status(StatusCode_1.HTTP_STATUS.NOT_FOUND_404).json({ errorsMessages: apiErrorMsg });
    }
    yield res.status(StatusCode_1.HTTP_STATUS.CREATED_201).json(postCreated);
}));
exports.PostRouter.put('/:id', auth_1.basicAuth, [titleValidation_1.titleValidation, contentValidation_1.contentValidation, shortDescriptionValidation_1.shortDescriptionValidation], input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postIsUpdated = yield post_data_access_layer_mongodb_1.postAccessLayerMongoDB.updatePost(req.params.id, req.body);
    const apiErrorMsg = [];
    if (!postIsUpdated) {
        apiErrorMsg.push({ message: "ID Not found", field: "id" });
        return yield res.status(StatusCode_1.HTTP_STATUS.NOT_FOUND_404).json({ errorsMessages: apiErrorMsg });
    }
    return yield res.status(StatusCode_1.HTTP_STATUS.NO_CONTENT_204).send();
}));
exports.PostRouter.delete('/:id', auth_1.basicAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_data_access_layer_mongodb_1.postAccessLayerMongoDB.deletePost(req.params.id);
    if (!post)
        yield res.status(StatusCode_1.HTTP_STATUS.NOT_FOUND_404).send("Not found");
    yield res.status(StatusCode_1.HTTP_STATUS.NO_CONTENT_204).send();
}));
