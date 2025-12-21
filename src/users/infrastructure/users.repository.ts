import { injectable } from "inversify";

import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { User } from "../types/user";
import { ObjectId, WithId } from "mongodb";
import { add } from "date-fns";
import { UserModel } from "./user.mongo";
import {UserEntity} from "../domain/user.entity";

@injectable()
export class UsersRepository {
  async findMany(
    queryDto: PaginationAndSorting<"login" | "email" | "createdAt">,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    const skip = (pageNumber - 1) * pageSize;
    const [items, totalCount] = await Promise.all([
      UserModel.find()
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(+pageSize)
        .lean(),

      UserModel.countDocuments({}),
    ]);
    return { items, totalCount };
  }

  async findById(id: string): Promise<WithId<User> | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return UserModel.findOne({ _id: new ObjectId(id) });
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    return UserModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ email: email });
  }

  async findByLogin(login: string) {
    return UserModel.findOne({ login: login });
  }

  async create(user: UserEntity) {
    const newUser = await UserModel.create(user);
    return newUser._id.toString();
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await UserModel.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }

  async deleteAllUsers() {
    await UserModel.deleteMany({});
  }

  async findByConfirmationCode(code: string) {
    return UserModel.findOne({
      "emailConfirmation.confirmationCode": code,
    }).lean();
  }

  async findBYEmailAndRefreshCode(email: string, code: string) {
    return UserModel.updateOne(
      { email },
      {
        $set: {
          "emailConfirmation.confirmationCode": code,
          "emailConfirmation.expirationDate": add(new Date(), {
            hours: 1,
            minutes: 30,
          }),
        },
      },
    );
  }

  async confirmCode(code: string) {
    return UserModel.updateOne(
      { "emailConfirmation.confirmationCode": code },
      { $set: { "emailConfirmation.isConfirmed": true } },
    ).lean();
  }

  async setRecoveryCode(email: string, recoveryCode: string) {
    return UserModel.updateOne(
      { email },
      {
        $set: {
          passwordRecovery: {
            recoveryCode,
            expirationDate: add(new Date(), { hours: 1 }), // код действителен 1 час
          },
        },
      },
    );
  }

  async findByRecoveryCode(recoveryCode: string) {
    return UserModel.findOne({
      "passwordRecovery.recoveryCode": recoveryCode,
    });
  }

  async updatePasswordByRecoveryCode(
    recoveryCode: string,
    hashedPassword: string,
  ) {
    return UserModel.updateOne(
      { "passwordRecovery.recoveryCode": recoveryCode },
      {
        $set: { password: hashedPassword },
        $unset: { passwordRecovery: "" }, // удаляем код после смены пароля
      },
    );
  }
}
