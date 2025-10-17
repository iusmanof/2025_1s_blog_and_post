import {body} from "express-validator";
import {usersRepository} from "../../../users/repositories/users.repository";


export const emailValidation =
    body("email")
        .trim()
        .isEmail()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage("Email is not correct")
        .custom(async (email: string) => {
            const user = await usersRepository.findByLoginOrEmail(email);
            if (user) {  // если пользователь найден
                throw new Error("Email already exists");
            }
            return true;
        })
