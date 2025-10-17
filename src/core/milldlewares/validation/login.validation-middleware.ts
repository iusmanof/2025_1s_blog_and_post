import {body} from "express-validator";
import {usersRepository} from "../../../users/repositories/users.repository";

export const loginValidation = body("login")
    .isString()
    .trim()
    .isLength({min: 3, max: 10})
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("Login is not correct")
    .custom(
        async (login: string):Promise<boolean> => {
            const user = await usersRepository.findByLoginOrEmail(login);
            if (user) {
                throw new Error("login already exist");
            }
            return true;
        }
    );