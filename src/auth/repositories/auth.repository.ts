import { getRefreshTokenCollection } from "../../core/db/mongo.db";

export class AuthRepository {
  async addTokenInBlackList(rfToken: string) {
    await getRefreshTokenCollection().insertOne({
      token: rfToken,
      createdAt: new Date(),
    });
  }
  async findRefreshTokenInBlackList(refresh_token: string) {
    return await getRefreshTokenCollection().findOne({ token: refresh_token });
  }
  async deleteRefreshTokenBlackList() {
    await getRefreshTokenCollection().deleteMany({});
  }
}
