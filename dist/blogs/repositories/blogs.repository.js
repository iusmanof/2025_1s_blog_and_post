"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsRepository = void 0;
const inversify_1 = require("inversify");
const mongo_db_1 = require("../../core/db/mongo.db");
const mongodb_1 = require("mongodb");
let BlogsRepository = class BlogsRepository {
  getAllBlogs(query) {
    return __awaiter(this, void 0, void 0, function* () {
      const {
        pageNumber = 1,
        pageSize = 10,
        sortBy = "createdAt",
        sortDirection = "desc",
        searchNameTerm,
      } = query;
      const skip = (pageNumber - 1) * pageSize;
      const sortDir = sortDirection === "asc" ? 1 : -1;
      const search = searchNameTerm
        ? { name: { $regex: searchNameTerm, $options: "i" } }
        : {};
      const result = yield (0, mongo_db_1.getBlogCollection)()
        .find(search)
        .sort({ [sortBy]: sortDir })
        .skip(+skip)
        .limit(+pageSize)
        .toArray();
      const blogWithId = result.map((_a) => {
        var { _id } = _a,
          rest = __rest(_a, ["_id"]);
        return Object.assign(Object.assign({}, rest), { id: _id.toString() });
      });
      const totalCount = (yield (0, mongo_db_1.getBlogCollection)()
        .find(search)
        .toArray()).length;
      return {
        pagesCount: +Math.ceil(totalCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: +totalCount,
        items: blogWithId,
      };
    });
  }
  getBlogById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield (0, mongo_db_1.getBlogCollection)().findOne({
        _id: new mongodb_1.ObjectId(id),
      });
      if (!result) {
        return null;
      }
      const blogWIthId = [Object.assign({}, result)].map((_a) => {
        var { _id } = _a,
          rest = __rest(_a, ["_id"]);
        return Object.assign(Object.assign({}, rest), { id: _id.toString() });
      });
      return blogWIthId[0];
    });
  }
  createBlog(blog) {
    return __awaiter(this, void 0, void 0, function* () {
      const blogCreatedWithDate = {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false,
      };
      const result = yield (0, mongo_db_1.getBlogCollection)().insertOne(
        Object.assign({}, blogCreatedWithDate),
      );
      return Object.assign(Object.assign({}, blogCreatedWithDate), {
        id: result.insertedId.toString(),
      });
    });
  }
  updateBlog(id, blog) {
    return __awaiter(this, void 0, void 0, function* () {
      const isUpdated = yield (0, mongo_db_1.getBlogCollection)().updateOne(
        { _id: new mongodb_1.ObjectId(id) },
        {
          $set: {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
          },
        },
      );
      return isUpdated.matchedCount !== 0;
    });
  }
  createPostByBlogId(body, blogId) {
    return __awaiter(this, void 0, void 0, function* () {
      const blog = yield this.getBlogById(body.blogId);
      const postCreated = {
        title: body.title,
        shortDescription: body.shortDescription,
        content: body.content,
        blogId: blogId,
        blogName: blog ? blog.name : "Unknown",
        createdAt: new Date().toISOString(),
      };
      const result = yield (0, mongo_db_1.getPostCollection)().insertOne(
        Object.assign({}, postCreated),
      );
      return Object.assign(Object.assign({}, postCreated), {
        id: result.insertedId.toString(),
      });
    });
  }
  deleteBlog(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const isDeleted = yield (0, mongo_db_1.getBlogCollection)().deleteOne({
        _id: new mongodb_1.ObjectId(id),
      });
      return isDeleted.deletedCount !== 0;
    });
  }
  deleteAllBlogs() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield (0, mongo_db_1.getBlogCollection)().deleteMany({});
    });
  }
};
exports.BlogsRepository = BlogsRepository;
exports.BlogsRepository = BlogsRepository = __decorate(
  [(0, inversify_1.injectable)()],
  BlogsRepository,
);
//# sourceMappingURL=blogs.repository.js.map
