import mongoose, { HydratedDocument, model, Model } from "mongoose";

export interface IEmailConfirmation {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}

export interface IPasswordRecovery {
  recoveryCode: string;
  expirationDate: Date;
}

export type UserProps = {
  login: string;
  email: string;
  passwordHash: string;
  emailConfirmation?: IEmailConfirmation;
  passwordRecovery?: IPasswordRecovery;
  createdAt: Date;
};

export type UserDocument = HydratedDocument<UserProps, UserMethods>;
type UserMethods = {
  confirmEmail(confirmationCode: string): boolean;
  initiatePasswordRecovery(recoveryCode: string, expirationDate: Date): void;
  isPasswordRecoveryValid(recoveryCode: string): boolean;
  isEmailConfirmed(): boolean;
};
type UserStaticMethods = typeof userStaticMethods;
type UserModelType = Model<UserProps, Record<string, never>, UserMethods> &
  UserStaticMethods;

const emailConfirmationSchema = new mongoose.Schema<IEmailConfirmation>(
  {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true, default: false },
  },
  { _id: false },
);

const passwordRecoverySchema = new mongoose.Schema<IPasswordRecovery>(
  {
    recoveryCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
  },
  { _id: false },
);

const userMethods = {
  confirmEmail(confirmationCode: string): boolean {
    if (
      (this as UserDocument).emailConfirmation &&
      (this as UserDocument).emailConfirmation!.confirmationCode ===
        confirmationCode
    ) {
      (this as UserDocument).emailConfirmation!.isConfirmed = true;
      (this as UserDocument).emailConfirmation!.expirationDate = new Date();
      return true;
    }
    return false;
  },

  initiatePasswordRecovery(recoveryCode: string, expirationDate: Date): void {
    (this as UserDocument).passwordRecovery = {
      recoveryCode,
      expirationDate,
    };
  },

  isPasswordRecoveryValid(recoveryCode: string): boolean {
    const passwordRecovery = (this as UserDocument).passwordRecovery;

    if (passwordRecovery) {
      return (
        passwordRecovery.recoveryCode === recoveryCode &&
        passwordRecovery.expirationDate > new Date()
      );
    }
    return false;
  },

  isEmailConfirmed(): boolean {
    return (this as UserDocument).emailConfirmation?.isConfirmed ?? false;
  },
};

const userStaticMethods = {
  createUser(login: string, email: string, passwordHash: string): UserDocument {
    return new UserModel({
      login,
      email,
      passwordHash,
      emailConfirmation: {
        confirmationCode: "",
        expirationDate: new Date(),
        isConfirmed: false,
      },
      passwordRecovery: {
        recoveryCode: "",
        expirationDate: new Date(),
      },
      createdAt: new Date(),
    });
  },
};

const userSchema = new mongoose.Schema<UserProps, UserModelType, UserMethods>(
  {
    login: { type: String, required: true, maxLength: 15 },
    email: { type: String, required: true, maxLength: 500, unique: true },
    passwordHash: { type: String, required: true, maxLength: 100 },
    emailConfirmation: { type: emailConfirmationSchema, required: false },
    passwordRecovery: { type: passwordRecoverySchema, required: false },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  },
);

userSchema.methods = userMethods;
userSchema.statics = userStaticMethods;

export const UserModel: UserModelType = model<UserProps, UserModelType>(
  "User",
  userSchema,
);
