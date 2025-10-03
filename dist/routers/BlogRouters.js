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
exports.BlogRouter = void 0;
const express_1 = require("express");
const StatusCode_1 = require("../StatusCode");
const auth_1 = require("../auth");
const nameValidation_1 = require("../bodyValidation/nameValidation");
const websiteValidation_1 = require("../bodyValidation/websiteValidation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const blog_data_access_layer_mongodb_1 = require("../dataAccessLayer/blog-data-access-layer-mongodb");
const express_validator_1 = require("express-validator");
exports.BlogRouter = (0, express_1.Router)();
exports.BlogRouter.get("/", [
    (0, express_validator_1.query)('searchNameTerm')
        .default(null),
    (0, express_validator_1.query)('sortBy')
        .default('createdAt'),
    (0, express_validator_1.query)('sortDirection')
        .default('desc'),
    (0, express_validator_1.query)('pageNumber')
        .default(1),
    (0, express_validator_1.query)('pageSize')
        .default(10)
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = req.query;
    console.log(searchNameTerm);
    console.log(sortBy);
    console.log(sortDirection);
    console.log(pageNumber);
    console.log(pageSize);
    const blogAll = yield blog_data_access_layer_mongodb_1.blogDataAccessLayerMongoDB.getAllBlogs();
    return yield res.status(StatusCode_1.HTTP_STATUS.OK_200).send(blogAll);
}));
exports.BlogRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogFounded = yield blog_data_access_layer_mongodb_1.blogDataAccessLayerMongoDB.getBlogById(req.params.id);
    if (!blogFounded)
        res.status(StatusCode_1.HTTP_STATUS.NOT_FOUND_404).send("Blog not found.");
    res.status(200).json(blogFounded);
}));
exports.BlogRouter.post('/', auth_1.basicAuth, [
    nameValidation_1.nameValidation,
    websiteValidation_1.websiteValidation,
], input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogCreated = yield blog_data_access_layer_mongodb_1.blogDataAccessLayerMongoDB.createBlog(req.body);
    return yield res.status(StatusCode_1.HTTP_STATUS.CREATED_201).json(blogCreated);
}));
exports.BlogRouter.put('/:id', auth_1.basicAuth, [
    nameValidation_1.nameValidation,
    websiteValidation_1.websiteValidation,
], input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogIsUpdated = yield blog_data_access_layer_mongodb_1.blogDataAccessLayerMongoDB.updateBlog(req.params.id, req.body);
    const apiErrorMsg = [];
    if (!blogIsUpdated) {
        apiErrorMsg.push({ message: "ID Not found", field: "id" });
        return yield res.status(StatusCode_1.HTTP_STATUS.NOT_FOUND_404).json({ errorsMessages: apiErrorMsg });
    }
    return yield res.status(StatusCode_1.HTTP_STATUS.NO_CONTENT_204).send();
}));
exports.BlogRouter.delete('/:id', auth_1.basicAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_data_access_layer_mongodb_1.blogDataAccessLayerMongoDB.deleteBlog(req.params.id);
    if (!blog)
        return yield res.status(StatusCode_1.HTTP_STATUS.NOT_FOUND_404).send("Not found");
    return yield res.status(StatusCode_1.HTTP_STATUS.NO_CONTENT_204).send();
}));
