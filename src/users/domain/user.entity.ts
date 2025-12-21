import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { IEmailConfirmation, IPasswordRecovery, User } from "../types/user";

export type UserHydrateDocument = HydratedDocument<User>;
type UserModel = Model<User>;

export const emailConfirmationSchema = new mongoose.Schema<IEmailConfirmation>(
  {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true, default: false },
  },
  { _id: false },
);

export const passwordRecoverySchema = new mongoose.Schema<IPasswordRecovery>(
  {
    recoveryCode: { type: String },
    expirationDate: { type: Date },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema<User>(
  {
    login: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      unique: true,
    },
    password: { type: String, required: true },
    // For a small project, emailConfirmation and passwordRecovery can be embedded in the user schema.
    // For a large project, create separate mongoose.Schema models for them.
    emailConfirmation: { type: emailConfirmationSchema, required: false },
    passwordRecovery: { type: passwordRecoverySchema, required: false },
  },
  { timestamps: true },
);

export const UserMongooseModel = model<User, UserModel>("user", userSchema);
