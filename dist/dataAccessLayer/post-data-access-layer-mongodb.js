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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAccessLayerMongoDB = void 0;
const db_1 = require("../repositories/db");
const mongodb_1 = require("mongodb");
const blog_data_access_layer_mongodb_1 = require("./blog-data-access-layer-mongodb");
exports.postAccessLayerMongoDB = {
    getAllPosts: () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.postCollection.find({}).toArray();
        let resultWithId;
        resultWithId = result.map((_a) => {
            var { _id } = _a, rest = __rest(_a, ["_id"]);
            return (Object.assign(Object.assign({}, rest), { id: _id.toString() }));
        });
        return resultWithId;
    }),
    getPostById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.postCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!result) {
            return null;
        }
        const postWithId = [Object.assign({}, result)].map((_a) => {
            var { _id } = _a, rest = __rest(_a, ["_id"]);
            return (Object.assign(Object.assign({}, rest), { id: _id.toString() }));
        });
        return postWithId[0];
    }),
    createPost: (post) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield blog_data_access_layer_mongodb_1.blogDataAccessLayerMongoDB.getBlogById(post.blogId);
        const postCreated = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blog ? blog.name : "Unknown",
            createdAt: new Date().toISOString()
        };
        const result = yield db_1.postCollection.insertOne(Object.assign({}, postCreated));
        return Object.assign(Object.assign({}, postCreated), { id: result.insertedId.toString() });
    }),
    deletePost: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const isDeleted = yield db_1.postCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        return (yield isDeleted.deletedCount) !== 0;
    }),
    updatePost: (id, post) => __awaiter(void 0, void 0, void 0, function* () {
        const updateFields = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
        };
        if (post.blogName) {
            updateFields.blogName = post.blogName;
        }
        const isUpdated = yield db_1.postCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: updateFields
        });
        return (yield isUpdated.matchedCount) !== 0;
    }),
    deleteAllPosts: () => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.postCollection.deleteMany({});
    }),
};
