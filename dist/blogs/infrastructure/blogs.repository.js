"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.BlogsRepository = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = __importDefault(require("mongoose"));
const blog_mongo_1 = require("./blog.mongo");
const blog_entity_1 = require("../domain/blog.entity");
let BlogsRepository = class BlogsRepository {
    save(blogEntity) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = blog_mongo_1.BlogModel.create_blog(blogEntity);
            yield blog.save();
            return blog;
        });
    }
    getAllBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc", searchNameTerm, } = query;
            const skip = (pageNumber - 1) * pageSize;
            const sortDir = sortDirection === "asc" ? 1 : -1;
            const filter = searchNameTerm
                ? { name: { $regex: searchNameTerm, $options: "i" } }
                : {};
            const blogs = yield blog_mongo_1.BlogModel
                .find(filter)
                .sort({ [sortBy]: sortDir })
                .skip(skip)
                .limit(pageSize)
                .lean();
            const items = blogs.map(blog => ({
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt.toISOString(),
                isMembership: blog.isMembership,
            }));
            const totalCount = yield blog_mongo_1.BlogModel.countDocuments(filter);
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: items,
            };
        });
    }
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.isValidObjectId(id)) {
                return null;
            }
            const doc = yield blog_mongo_1.BlogModel.findById(id).lean();
            if (!doc)
                return null;
            return blog_entity_1.BlogEntity.restore({
                id: doc._id.toString(),
                name: doc.name,
                description: doc.description,
                websiteUrl: doc.websiteUrl,
                isMembership: doc.isMembership,
            });
        });
    }
    deleteBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!blog.getId())
                return;
            yield blog_mongo_1.BlogModel.findByIdAndDelete(blog.getId());
        });
    }
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return blog_mongo_1.BlogModel.deleteMany({});
        });
    }
};
exports.BlogsRepository = BlogsRepository;
exports.BlogsRepository = BlogsRepository = __decorate([
    (0, inversify_1.injectable)()
], BlogsRepository);
// async getBlogById(id: string): Promise<BlogEntity | null> {
//     if (!mongoose.isValidObjectId(id)) return null;
//
// const doc = await BlogModel.findById(id);
// if (!doc) return null;
//
// // Восстанавливаем Domain Entity из документа
// return BlogEntity.restore({
//     id: doc._id.toString(),
//     name: doc.name,
//     description: doc.description,
//     websiteUrl: doc.websiteUrl,
//     isMembership: doc.isMembership,
// });
// }
//
//# sourceMappingURL=blogs.repository.js.map