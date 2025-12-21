import { body } from "express-validator";
import { container } from "../../composition.root";
import { UsersRepository } from "../../users/infrastructure/users.repository";
const usersRepository = container.get(UsersRepository);

export const loginRegistrationValidationMiddleware = body("login")
  .isString()
  .trim()
  .isLength({ min: 3, max: 10 })
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage("Login is not correct")
  .custom(async (login: string): Promise<boolean> => {
    const user = await usersRepository.findByLogin(login);
    if (user) {
      throw new Error("Login already exists");
    }
    return true;
  });
