import {usersRepository} from "../../users/repositories/users.repository";
import {bcryptAdapter} from "../adapters/bcrypt.adapter";
import {ResultObject, resultStatus} from "../../core/types/result-object";
import {jwtAdapter} from "../adapters/jwt.adapter";
import {randomUUID} from "crypto";
import {emailAdapter} from "../adapters/email.adapter";
import {add} from 'date-fns';
import {UserDbDto} from "../../users/types/user-db-dto";
import {emailExampleTemplate} from "../../core/types/email-example.template";

export const authService = {
    async login(loginOrEmail: string, password: string): Promise<ResultObject<{ accessToken: string } | null>> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) {
            return {
                status: resultStatus.ERROR,
                errorMessages: 'Unauthorized',
                extensions: [{message: "Not found", field: "loginOrEmail"}],
                data: null
            }
        }

        const passwordCorrect = await bcryptAdapter.checkPassword(password, user.password);
        if (!passwordCorrect) {
            return {
                status: resultStatus.ERROR,
                errorMessages: 'Bad request',
                extensions: [{message: "Wrong password", field: "password"}],
                data: null
            }
        }

        const accessToken = await jwtAdapter.signToken(user._id.toString());

        return {
            status: resultStatus.SUCCESS,
            data: {accessToken},
            extensions: [],
        }
    },
    async registerUser(login: string, email: string, password: string): Promise<ResultObject<UserDbDto | null | string>> {
        const passwordHash = await bcryptAdapter.generateHash(password);
        const newUser: UserDbDto = {
            login: login,
            email: email,
            password: passwordHash,
            createdAt: new Date(),
            emailConfirmation: {
                    confirmationCode: randomUUID(),
                    expirationDate: add(new Date(), {hours: 1, minutes: 30}),
                    isConfirmed: false,
            }

        }
        await usersRepository.create(newUser)

        if (newUser.emailConfirmation) {
            try {
                await emailAdapter.nodemailer(
                    email,
                    emailExampleTemplate.registrationEmail(newUser.emailConfirmation.confirmationCode)
                )
            } catch (err) {
                console.log("send email error")
            }
        }
        return {
            status: resultStatus.SUCCESS,
            extensions: [],
            data: "code send"
        };
    },
    async confirmUser(code: string): Promise<ResultObject<UserDbDto | null>> {
        const user = await usersRepository.findByConfirmationCode(code);

        // if (!user || !user.emailConfirmation || !user.emailConfirmation.expirationDate) {
        if (!user) {
            return {
                status: resultStatus.BAD_REQUEST,
                errorMessages: 'Bad request',
                extensions: [{message: "Invalid code", field: "code"}],
                data: null
            }
        }

        if (user.emailConfirmation!.isConfirmed) {
            return {
                status: resultStatus.BAD_REQUEST,
                errorMessages: "Bad request",
                extensions: [{ message: "Code already confirmed", field: "code"}],
                data: null
            }
        }

        if ( user.emailConfirmation?.expirationDate! < new Date() ) {
            return {
                status: resultStatus.CODE_EXPIRED,
                errorMessages: 'Bad request',
                extensions: [{ message: "Code expired", field: "code" }],
                data: null
            }
        }

        await usersRepository.confirmCode(code);

        return {
            status: resultStatus.SUCCESS,
            extensions: [],
            data: user
        };
    },
    async resendCode(email: string): Promise<ResultObject<UserDbDto | null | string>> {
        const user = await usersRepository.findByEmail(email);

        if (!user) {
            return {
                status: resultStatus.NOT_FOUND,
                errorMessages: 'Email not found',
                extensions: [{ message: 'Email not exists', field: 'email'}],
                data: null
            }
        }
        if (user!.emailConfirmation?.isConfirmed) {
            return {
                status: resultStatus.BAD_REQUEST,
                errorMessages: 'Bad request',
                extensions: [{message: "Email is already confirmed", field: "email"}],
                data: null
            }
        }

        const codeRefreshed: string =  randomUUID();
        await usersRepository.findBYEmailAndRefreshCode(email, codeRefreshed);


        try {
            await emailAdapter.nodemailer(
                email,
                emailExampleTemplate.registrationEmail(codeRefreshed)
            )
        } catch (err) {
            console.log("send email error")
        }

        return {
            status: resultStatus.SUCCESS,
            extensions: [],
            data: null
        };
    }

}