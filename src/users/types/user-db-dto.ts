export interface UserDbDto {
    login: string
    email: string;
    password: string;
    createdAt: Date,
    // refactor
    emailConfirmation?: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: false
    }
}