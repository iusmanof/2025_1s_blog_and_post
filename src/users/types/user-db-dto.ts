export interface UserDbDto {
    login: string;
    email: string;
    password: string;
    createdAt: Date;
    // REFACTORING
    passwordRecovery?: {
        recoveryCode: string;
        expirationDate: Date;
    };
    // REFACTORING
    emailConfirmation?: {
        confirmationCode: string;
        expirationDate: Date;
        isConfirmed: false;
    };
}
