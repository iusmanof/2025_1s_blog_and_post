import { injectable } from "inversify";

import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { getUserCollection } from "../../core/db/mongo.db";
import { UserDbDto } from "../types/user-db-dto";
import { ObjectId, WithId } from "mongodb";
import { add } from "date-fns";

@injectable()
export class UsersRepository {
  async findMany(
    queryDto: PaginationAndSorting<"login" | "email" | "createdAt">,
  ): Promise<{ items: UserDbDto[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const filter = {};
    const skip = (pageNumber - 1) * pageSize;
    const [items, totalCount] = await Promise.all([
      getUserCollection()
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(+pageSize)
        .toArray(),
      getUserCollection().countDocuments(filter),
    ]);
    return { items, totalCount };
  }
  async findById(id: string): Promise<WithId<UserDbDto> | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return getUserCollection().findOne({ _id: new ObjectId(id) });
  }
  async findByLoginOrEmail(loginOrEmail: string) {
    return await getUserCollection().findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  }
  async findByEmail(email: string) {
    return await getUserCollection().findOne({ email: email });
  }
  async findByLogin(login: string) {
    return await getUserCollection().findOne({ login: login });
  }
  async create(user: UserDbDto): Promise<string> {
    const newUser = await getUserCollection().insertOne({ ...user });
    return newUser.insertedId.toString();
  }
  async delete(id: string): Promise<boolean> {
    const deleteResult = await getUserCollection().deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }
  async deleteAllUsers() {
    await getUserCollection().deleteMany({});
  }
  async findByConfirmationCode(code: string) {
    return getUserCollection().findOne({
      "emailConfirmation.confirmationCode": code,
    });
  }
  async findBYEmailAndRefreshCode(email: string, code: string) {
    return await getUserCollection().updateOne(
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
    return await getUserCollection().updateOne(
      { "emailConfirmation.confirmationCode": code },
      { $set: { "emailConfirmation.isConfirmed": true } },
    );
  }
}
