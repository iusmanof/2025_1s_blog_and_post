import { injectable } from "inversify";

import { UserResponseCreateDto } from "../types/user-response-create-dto";
import { ObjectId, WithId } from "mongodb";
import {
  IPagination,
  PaginationAndSortingUser,
} from "../../core/types/pagination-and-sorting";
import { UserModel  } from "./user.mongo";
import { User } from "../types/user";

@injectable()
export class UsersQueryRepository {
  async findAllUsers(
    sortQueryDto: PaginationAndSortingUser,
  ) {
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
    const totalCount = await UserModel.countDocuments(filter);
    const users = await UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(+skip)
      .limit(+pageSize)
      .exec();

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: [{id: '11', login: '111', email: '123d@fe', createdAt: new Date() }]
      // items: users.map((user) => this._getInView(user)),
    };
  }

  async findById(id: string) {
    if (!ObjectId.isValid(id)) return null;

    const user = await UserModel.findById({
      _id: new ObjectId(id),
    });
    if (!user) {
      return null;
    }
      return {id: '11', login: '111', email: '123d@fe', createdAt: new Date() };
      // return this._getInView(user);
  }

  _getFilter(
    loginQuery: string | null,
    emailQuery: string | null,
  ): {
    login?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  } {
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
}
