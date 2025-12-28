import mongoose, { Model } from "mongoose";
import { IRToken } from "../types/rtoken";

interface RTokenModel extends Model<IRToken> {
  addTokenInBlackList(token: string): Promise<void>;
  findRefreshTokenInBlackList(token: string): Promise<IRToken | null>;
  deleteRefreshTokenBlackList(): Promise<void>;
}

export const rtokenSchema = new mongoose.Schema<IRToken>(
  { token: { type: String, required: true } },
  { timestamps: true },
);

rtokenSchema.statics.addTokenInBlackList = async function (token: string) {
  await this.create({ token });
};

rtokenSchema.statics.findRefreshTokenInBlackList = function (token: string) {
  return this.findOne({ token }).exec();
};

rtokenSchema.statics.deleteRefreshTokenBlackList = async function () {
  await this.deleteMany({}).exec();
};

export const RTokenMongooseModel = mongoose.model<IRToken, RTokenModel>(
  "rtoken",
  rtokenSchema,
);
