import {usersRepository} from "../../users/repositories/users.repository";
import {bcryptAdapter} from "../adapters/bcrypt.adapter";
import {ResultObject, ResultStatus} from "../../core/types/result-object";
import {jwtAdapter} from "../adapters/jwt.adapter";

export const authService = {
    async login(loginOrEmail: string, password: string): Promise<ResultObject<{ accessToken: string } | null>> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) {
            return {
                status: ResultStatus.ERROR,
                errorMessages: 'Unauthorized',
                extensions: [{message: "Not found", field: "loginOrEmail"}],
                data: null
            }
        }

        const passwordCorrect = await bcryptAdapter.checkPassword(password, user.passwordhash);
        if (!passwordCorrect) {
            return {
                status: ResultStatus.ERROR,
                errorMessages: 'Bad request',
                extensions: [{message: "Wrong password", field: "password"}],
                data: null
            }
        }

        const accessToken = await jwtAdapter.signToken(user._id.toString());

        return {
            status: ResultStatus.SUCCESS,
            data: {accessToken},
            extensions: [],
        }
    },
}