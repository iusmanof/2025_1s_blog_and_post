import { EntityParams } from "../types/user";

export class UserEntity {
  private login: string;
  private email: string;
  private passwordHash: string;

  constructor(params: EntityParams) {
    this.login = params.login;
    this.email = params.email;
    this.passwordHash = params.passwordHash;
  }

  getLogin() {
    return this.login;
  }

  getEmail() {
    return this.email;
  }

  getPasswordHash() {
    return this.passwordHash;
  }
}
