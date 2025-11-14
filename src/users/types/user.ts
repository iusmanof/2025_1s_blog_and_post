export type User = {
  login: string;
  password: string;
  email: string;
};

export type UserDB = {
  login: string;
  email: string;
};

export type IUserDB = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: false;
  };
};
