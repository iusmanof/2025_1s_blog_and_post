import { body } from "express-validator";
import { container } from "../../../composition.root";
import { UsersRepository } from "../../../users/infrastructure/users.repository";
const usersRepository = container.get(UsersRepository);

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
