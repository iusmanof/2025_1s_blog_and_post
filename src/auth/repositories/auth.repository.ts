import { injectable } from "inversify";
import { RTokenMongooseModel } from "../domain/rtoken.entiry";

@injectable()
export class AuthRepository {
  async addTokenInBlackList(rfToken: string) {
    await RTokenMongooseModel.create({
      token: rfToken,
      createdAt: new Date(),
    });
  }
  async findRefreshTokenInBlackList(refresh_token: string) {
    return await RTokenMongooseModel.findOne({ token: refresh_token }).exec();
  }
  async deleteRefreshTokenBlackList() {
    await RTokenMongooseModel.deleteMany({}).exec();
  }
}
