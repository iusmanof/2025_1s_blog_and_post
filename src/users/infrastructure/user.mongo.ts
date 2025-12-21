import mongoose, { HydratedDocument, model, Model } from "mongoose";

// Типы для подтверждения email и восстановления пароля
export interface IEmailConfirmation {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
}

export interface IPasswordRecovery {
    recoveryCode: string;
    expirationDate: Date;
}

// Основной тип пользователя
export type UserProps = {
    login: string;
    email: string;
    passwordHash: string;
    emailConfirmation?: IEmailConfirmation; // Опционально для подтверждения email
    passwordRecovery?: IPasswordRecovery; // Опционально для восстановления пароля
};

// Тип для документа пользователя с методами
export type UserDocument = HydratedDocument<UserProps, UserMethods>;
type UserMethods = {
    confirmEmail(confirmationCode: string): boolean;
    initiatePasswordRecovery(recoveryCode: string, expirationDate: Date): void;
    isPasswordRecoveryValid(recoveryCode: string): boolean;
};
type UserStaticMethods = typeof userStaticMethods;
type UserModelType = Model<UserProps, {}, UserMethods> & UserStaticMethods;

// Схема для подтверждения email
const emailConfirmationSchema = new mongoose.Schema<IEmailConfirmation>(
    {
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        isConfirmed: { type: Boolean, required: true, default: false },
    },
    { _id: false }
);

// Схема для восстановления пароля
const passwordRecoverySchema = new mongoose.Schema<IPasswordRecovery>(
    {
        recoveryCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
    },
    { _id: false }
);

const userMethods = {
    confirmEmail(confirmationCode: string): boolean {
        if (
            (this as UserDocument).emailConfirmation &&
            (this as UserDocument).emailConfirmation!.confirmationCode === confirmationCode
        ) {
            (this as UserDocument).emailConfirmation!.isConfirmed = true;
            (this as UserDocument).emailConfirmation!.expirationDate = new Date(); // Устанавливаем дату подтверждения
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
        if (
            (this as UserDocument).passwordRecovery &&
            (this as UserDocument).passwordRecovery!.recoveryCode === recoveryCode &&
            (this as UserDocument).passwordRecovery!.expirationDate > new Date()
        ) {
            return true;
        }
        return false;
    },
};


// Статические методы для создания пользователя
const userStaticMethods = {
    create_user(login: string, email: string, passwordHash: string): UserDocument {
        return new UserModel({
            login,
            email,
            passwordHash,
            emailConfirmation: { confirmationCode: "", expirationDate: new Date(), isConfirmed: false },
            passwordRecovery: { recoveryCode: "", expirationDate: new Date() }
        });
    },
};

// Схема пользователя
const userSchema = new mongoose.Schema<UserProps, UserModelType, UserMethods>(
    {
        login: { type: String, required: true, maxLength: 15 },
        email: { type: String, required: true, maxLength: 500, unique: true },
        passwordHash: { type: String, required: true, maxLength: 100 },
        emailConfirmation: { type: emailConfirmationSchema, required: false },
        passwordRecovery: { type: passwordRecoverySchema, required: false },
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    }
);

// Привязываем методы к схеме
userSchema.methods = userMethods;
userSchema.statics = userStaticMethods;

// Экспорт модели пользователя
export const UserModel: UserModelType = model<UserProps, UserModelType>("user", userSchema);
