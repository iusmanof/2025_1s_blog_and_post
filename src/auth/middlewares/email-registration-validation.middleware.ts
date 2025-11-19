import { body } from "express-validator";
import {usersRepository} from "../../composition.root";
// import { usersRepository } from "../../users/repositories/users.repository";

export const emailRegistrationValidationMiddleware = body("email")
  .trim()
  .isEmail()
  .matches(/^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/)
  .withMessage("Email is not correct")
  .custom(async (email) => {
    const user = await usersRepository.findByEmail(email);
    if (user) {
      throw new Error("Email already exists");
    }
    return true;
  });
