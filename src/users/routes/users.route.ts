import { container } from "../../composition.root";
import { Router } from "express";
import { basicAuth } from "../../core/milldlewares/super-admin.guard-middleware";
import { paginationAndSortingValidationWithEmailAndLogin } from "../../core/milldlewares/query-pagination-sorting.validation-middleware";
import { passwordValidation } from "../../auth/middlewares/password.validation-middleware";
import { loginValidation } from "../../core/milldlewares/login.validation-middleware";
import { emailValidation } from "../../core/milldlewares/email.validation-middleware";
import { inputValidationMiddleware } from "../../core/milldlewares/input-validation-middleware";
import { usersInputValidationMiddleware } from "../../core/milldlewares/users-input.validation-middleware";
import { UserController } from "../controllers/user.controller";

const userController = container.get(UserController);

export const userRouter = Router();

userRouter.use(basicAuth);

userRouter.get(
  "/",
  paginationAndSortingValidationWithEmailAndLogin(),
  inputValidationMiddleware,
  userController.findAllUsers,
);

userRouter.post(
  "/",
  loginValidation,
  passwordValidation,
  emailValidation,
  usersInputValidationMiddleware,
  userController.createUser,
);

userRouter.delete("/:id", basicAuth, userController.delete);
