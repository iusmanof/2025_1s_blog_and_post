import { injectable } from "inversify";
import { RTokenMongooseModel } from "./rtoken.mongo";

@injectable()
export class AuthRepository {
  async addTokenInBlackList(rfToken: string) {
    await RTokenMongooseModel.addTokenInBlackList(rfToken);
  }

  async findRefreshTokenInBlackList(refresh_token: string) {
    return RTokenMongooseModel.findRefreshTokenInBlackList(refresh_token);
  }

  async deleteRefreshTokenBlackList() {
    await RTokenMongooseModel.deleteRefreshTokenBlackList();
  }
}
