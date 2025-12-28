import { injectable } from "inversify";

import { UserResponseCreateDto } from "../types/user-response-create-dto";
import { ObjectId } from "mongodb";
import { PaginationAndSortingUser } from "../../core/types/pagination-and-sorting";
import { UserDocument, UserModel } from "./user.mongo";

@injectable()
export class UsersQueryRepository {
  async findAllUsers(sortQueryDto: PaginationAndSortingUser) {
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
      items: users.map((user) => this._getInView(user)),
    };
  }

  async findById(id: string) {
    if (!ObjectId.isValid(id)) return null;

    const user = await UserModel.findById(id);
    if (!user) return null;

    return this._getInView(user);
  }

  _getInView(user: UserDocument): UserResponseCreateDto {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }

  _getFilter(
    loginQuery: string | null,
    emailQuery: string | null,
  ): {
    login?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  } {
    const filter: {
      login?: { $regex: string; $options: string };
      email?: { $regex: string; $options: string };
    } = {};

    if (loginQuery) {
      filter.login = { $regex: loginQuery, $options: "i" };
    }

    if (emailQuery) {
      filter.email = { $regex: emailQuery, $options: "i" };
    }

    return filter;
  }
}
