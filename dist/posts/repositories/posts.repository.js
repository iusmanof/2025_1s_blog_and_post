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
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
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
exports.PostsRepository = void 0;
const inversify_1 = require("inversify");
const mongo_db_1 = require("../../core/db/mongo.db");
const mongodb_1 = require("mongodb");
const blogs_repository_1 = require("../../blogs/repositories/blogs.repository");
let PostsRepository = class PostsRepository {
  constructor(blogsRepository) {
    this.blogsRepository = blogsRepository;
  }
  getAllPosts(query) {
    return __awaiter(this, void 0, void 0, function* () {
      const {
        pageNumber = 1,
        pageSize = 10,
        sortBy = "createdAt",
        sortDirection = "desc",
      } = query;
      const skip = (pageNumber - 1) * pageSize;
      const sortDir = sortDirection === "asc" ? 1 : -1;
      const result = yield (0, mongo_db_1.getPostCollection)()
        .find({})
        .sort({ [sortBy]: sortDir })
        .skip(+skip)
        .limit(+pageSize)
        .toArray();
      let resultWithId;
      resultWithId = result.map((_a) => {
        var { _id } = _a,
          rest = __rest(_a, ["_id"]);
        return Object.assign(Object.assign({}, rest), { id: _id.toString() });
      });
      const totalCount = yield (0,
      mongo_db_1.getPostCollection)().countDocuments({});
      return {
        pagesCount: +Math.ceil(totalCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: +totalCount,
        items: resultWithId,
      };
    });
  }
  getPostById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield (0, mongo_db_1.getPostCollection)().findOne({
        _id: new mongodb_1.ObjectId(id),
      });
      if (!result) {
        return null;
      }
      const postWithId = [Object.assign({}, result)].map((_a) => {
        var { _id } = _a,
          rest = __rest(_a, ["_id"]);
        return Object.assign(Object.assign({}, rest), { id: _id.toString() });
      });
      return postWithId[0];
    });
  }
  createPost(post) {
    return __awaiter(this, void 0, void 0, function* () {
      const blog = yield this.blogsRepository.getBlogById(post.blogId);
      const postCreated = {
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
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
  createPostByBlogId(post, blogId) {
    return __awaiter(this, void 0, void 0, function* () {
      const blog = yield this.blogsRepository.getBlogById(post.blogId);
      const postCreated = {
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
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
  deletePost(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const isDeleted = yield (0, mongo_db_1.getPostCollection)().deleteOne({
        _id: new mongodb_1.ObjectId(id),
      });
      return (yield isDeleted.deletedCount) !== 0;
    });
  }
  updatePost(id, post) {
    return __awaiter(this, void 0, void 0, function* () {
      const updateFields = {
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
      };
      if (post.blogName) {
        updateFields.blogName = post.blogName;
      }
      const isUpdated = yield (0, mongo_db_1.getPostCollection)().updateOne(
        { _id: new mongodb_1.ObjectId(id) },
        {
          $set: updateFields,
        },
      );
      return (yield isUpdated.matchedCount) !== 0;
    });
  }
  deleteAllPosts() {
    return __awaiter(this, void 0, void 0, function* () {
      yield (0, mongo_db_1.getPostCollection)().deleteMany({});
    });
  }
  getPostByBlogId(blogId, query) {
    return __awaiter(this, void 0, void 0, function* () {
      const {
        pageNumber = 1,
        pageSize = 10,
        sortBy = "createdAt",
        sortDirection = "desc",
      } = query;
      const skip = (pageNumber - 1) * pageSize;
      const sortDir = sortDirection === "asc" ? 1 : -1;
      const result = yield (0, mongo_db_1.getPostCollection)()
        .find({ blogId })
        .sort({ [sortBy]: sortDir })
        .skip(+skip)
        .limit(+pageSize)
        .toArray();
      const postWithId = result.map((_a) => {
        var { _id } = _a,
          rest = __rest(_a, ["_id"]);
        return Object.assign(Object.assign({}, rest), { id: _id.toString() });
      });
      const totalCount = yield (0,
      mongo_db_1.getPostCollection)().countDocuments({ blogId });
      const resultWithMeta = {
        pagesCount: +Math.ceil(totalCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: +totalCount,
        items: postWithId,
      };
      return yield resultWithMeta;
    });
  }
};
exports.PostsRepository = PostsRepository;
exports.PostsRepository = PostsRepository = __decorate(
  [
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_repository_1.BlogsRepository)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository]),
  ],
  PostsRepository,
);
//# sourceMappingURL=posts.repository.js.map
