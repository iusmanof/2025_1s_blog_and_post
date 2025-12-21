"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor(params) {
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
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map