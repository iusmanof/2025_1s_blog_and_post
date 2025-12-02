import { injectable } from "inversify";

import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { User } from "../types/user";
import { ObjectId, WithId } from "mongodb";
import { add } from "date-fns";
import { UserMongooseModel } from "../domain/user.entity";
import { UserCreateDto } from "../types/user-create-dto";

@injectable()
export class UsersRepository {
  async findMany(
    queryDto: PaginationAndSorting<"login" | "email" | "createdAt">,
  ): Promise<{ items: User[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    const skip = (pageNumber - 1) * pageSize;
    const [items, totalCount] = await Promise.all([
      UserMongooseModel.find()
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(+pageSize)
        .lean(),

      UserMongooseModel.countDocuments({}),
    ]);
    return { items, totalCount };
  }

  async findById(id: string): Promise<WithId<User> | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return UserMongooseModel.findOne({ _id: new ObjectId(id) });
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    return UserMongooseModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  }

  async findByEmail(email: string) {
    return UserMongooseModel.findOne({ email: email });
  }

  async findByLogin(login: string) {
    return UserMongooseModel.findOne({ login: login });
  }

  async create(user: UserCreateDto) {
    const newUser = await UserMongooseModel.create(user);
    return newUser._id.toString();
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await UserMongooseModel.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }

  async deleteAllUsers() {
    await UserMongooseModel.deleteMany({});
  }

  async findByConfirmationCode(code: string) {
    return UserMongooseModel.findOne({
      "emailConfirmation.confirmationCode": code,
    });
  }

  async findBYEmailAndRefreshCode(email: string, code: string) {
    return UserMongooseModel.updateOne(
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
    return UserMongooseModel.updateOne(
      { "emailConfirmation.confirmationCode": code },
      { $set: { "emailConfirmation.isConfirmed": true } },
    );
  }

  async setRecoveryCode(email: string, recoveryCode: string) {
    return UserMongooseModel.updateOne(
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
    return UserMongooseModel.findOne({
      "passwordRecovery.recoveryCode": recoveryCode,
    });
  }

  async updatePasswordByRecoveryCode(
    recoveryCode: string,
    hashedPassword: string,
  ) {
    return UserMongooseModel.updateOne(
      { "passwordRecovery.recoveryCode": recoveryCode },
      {
        $set: { password: hashedPassword },
        $unset: { passwordRecovery: "" }, // удаляем код после смены пароля
      },
    );
  }
}
