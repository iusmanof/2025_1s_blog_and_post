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
  password: string;
  passwordRecovery: IPasswordRecovery | null;
  emailConfirmation: IEmailConfirmation;
  createdAt: Date;
}
