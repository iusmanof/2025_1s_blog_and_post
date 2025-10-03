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
exports.blogDataAccessLayerMongoDB = void 0;
const db_1 = require("../repositories/db");
const mongodb_1 = require("mongodb");
exports.blogDataAccessLayerMongoDB = {
    getAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogCollection.find({}).toArray();
            const blogWithId = result.map((_a) => {
                var { _id } = _a, rest = __rest(_a, ["_id"]);
                return (Object.assign(Object.assign({}, rest), { id: _id.toString() }));
            });
            return blogWithId;
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!result) {
                return null;
            }
            const blogWIthId = [Object.assign({}, result)].map((_a) => {
                var { _id } = _a, rest = __rest(_a, ["_id"]);
                return (Object.assign(Object.assign({}, rest), { id: _id.toString() }));
            });
            return blogWIthId[0];
        });
    },
    createBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogCreatedWithDate = {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            const result = yield db_1.blogCollection.insertOne(Object.assign({}, blogCreatedWithDate));
            return Object.assign(Object.assign({}, blogCreatedWithDate), { id: result.insertedId.toString() });
        });
    },
    updateBlog(id, blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield db_1.blogCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { name: blog.name, description: blog.description, websiteUrl: blog.websiteUrl } });
            return isUpdated.matchedCount !== 0;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield db_1.blogCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return isDeleted.deletedCount !== 0;
        });
    },
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogCollection.deleteMany({});
        });
    }
};
