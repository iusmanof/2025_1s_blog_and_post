import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { IRToken } from "../types/rtoken";

export type RTokenHydrateDocument = HydratedDocument<IRToken>;
type RTokenModel = Model<IRToken>;

export const rtokenSchema = new mongoose.Schema<IRToken>(
  {
    token: { type: String, required: true },
  },
  { timestamps: true },
);

export const RTokenMongooseModel = model<IRToken, RTokenModel>(
  "rtoken",
  rtokenSchema,
);
