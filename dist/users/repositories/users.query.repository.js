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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersQueryRepository = void 0;
const inversify_1 = require("inversify");
const mongo_db_1 = require("../../core/db/mongo.db");
const mongodb_1 = require("mongodb");
let UsersQueryRepository = class UsersQueryRepository {
  findAllUsers(sortQueryDto) {
    return __awaiter(this, void 0, void 0, function* () {
      const {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
        searchEmailTerm,
        searchLoginTerm,
      } = sortQueryDto;
      const skip = (pageNumber - 1) * pageSize;
      const filter = this._getFilter(searchLoginTerm, searchEmailTerm);
      const totalCount = yield (0,
      mongo_db_1.getUserCollection)().countDocuments(filter);
      const users = yield (0, mongo_db_1.getUserCollection)()
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(+skip)
        .limit(+pageSize)
        .toArray();
      return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount,
        items: users.map((u) => this._getInView(u)),
      };
    });
  }
  findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield (0, mongo_db_1.getUserCollection)().findOne({
        _id: new mongodb_1.ObjectId(id),
      });
      if (!user) {
        return null;
      }
      return this._getInView(user);
    });
  }
  _getInView(user) {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt ? user.createdAt.toISOString() : null,
    };
  }
  _getFilter(loginQuery, emailQuery) {
    // let filter: { login?: { $regex: string; $options: string }, email?: { $regex: string; $options: string } } = {};
    const filters = [];
    if (loginQuery) {
      filters.push({ login: { $regex: loginQuery, $options: "i" } });
    }
    if (emailQuery) {
      filters.push({ email: { $regex: emailQuery, $options: "i" } });
    }
    if (filters.length === 0) {
      return {};
    }
    if (filters.length === 1) {
      return filters[0];
    }
    // @ts-ignore
    return { $or: filters };
  }
};
exports.UsersQueryRepository = UsersQueryRepository;
exports.UsersQueryRepository = UsersQueryRepository = __decorate(
  [(0, inversify_1.injectable)()],
  UsersQueryRepository,
);
//# sourceMappingURL=users.query.repository.js.map
