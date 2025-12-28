import { body } from "express-validator";
import { UsersRepository } from "../../../users/infrastructure/users.repository";
import { container } from "../../../composition.root";

const usersRepository = container.get(UsersRepository);

export const emailValidation = body("email")
  .trim()
  .isEmail()
  .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
  .withMessage("Email is not correct")
  .custom(async (email: string) => {
    const user = await usersRepository.findByLoginOrEmail(email);
    if (user) {
      throw new Error("Email already exists");
    }
    return true;
  });
