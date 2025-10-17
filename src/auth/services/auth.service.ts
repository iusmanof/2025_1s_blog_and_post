import {usersRepository} from "../../users/repositories/users.repository";
import {bcryptAdapter} from "../adapters/bcrypt.adapter";
import {errorMessage} from "../types/error-message";

export const authService = {
    async login(loginOrEmail: string, password: string): Promise<boolean | errorMessage> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) {
            return {
                "errorsMessages": [
                    {
                        "message": "Not found",
                        "field": "loginOrEmail"
                    }
                ]
            }
        }

        const passwordCorrect = await bcryptAdapter.checkPassword(password, user.passwordhash);
        if (!passwordCorrect) {
            return {
                "errorsMessages": [
                    {
                        "message": "Wrong password",
                        "field": "password"
                    }
                ]
            }
        }

        // const accessToken = await jwtAdapter.signToken(loginOrEmail);

        // return accessToken + true
        return true
    },
}