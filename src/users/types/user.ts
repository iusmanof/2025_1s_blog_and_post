export interface IEmailConfirmation {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}
export interface IPasswordRecovery {
  recoveryCode: string;
  expirationDate: Date;
}

export interface User {
  login: string;
  email: string;
  passwordHash: string;
  passwordRecovery: IPasswordRecovery | null;
  emailConfirmation: IEmailConfirmation;
  createdAt: Date;
}


export interface EntityParams {
    login: string;
    email: string;
    passwordHash: string;
}

export type UserProps = {
    login: string;
    email: string;
    password: string;
}