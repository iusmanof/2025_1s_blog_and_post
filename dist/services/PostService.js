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
const post_data_access_layer_mongodb_1 = require("../dataAccessLayer/post-data-access-layer-mongodb");
const PostService = {
    findMany: () => __awaiter(void 0, void 0, void 0, function* () {
        // Business logic layer
        return yield post_data_access_layer_mongodb_1.postDataAccessLayerMongoDB.getAllPosts();
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        // Business logic layer
        return yield post_data_access_layer_mongodb_1.postDataAccessLayerMongoDB.getPostById(id);
    }),
    create: (body) => __awaiter(void 0, void 0, void 0, function* () {
        // Business logic layer
        return yield post_data_access_layer_mongodb_1.postDataAccessLayerMongoDB.createPost(body);
    }),
    update: (id, body) => __awaiter(void 0, void 0, void 0, function* () {
        // Business logic layer
        return yield post_data_access_layer_mongodb_1.postDataAccessLayerMongoDB.updatePost(id, body);
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        // Business logic layer
        return yield post_data_access_layer_mongodb_1.postDataAccessLayerMongoDB.deletePost(id);
    }),
};
exports.default = PostService;
