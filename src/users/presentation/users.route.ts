import { container } from "../../composition.root";
import { Router } from "express";
import { UserController } from "./user.controller";
import { inputUsersValidationMiddleware } from "./middlewares/users-input.validation-middleware";
import { emailValidation } from "../../auth/presentation/middlewares/email-validation.middleware";
import { passwordValidation } from "../../auth/presentation/middlewares/password-validation.middleware";
import { loginValidation } from "./middlewares/login-validation-middleware";
import { basicAuth } from "../../core/milldlewares/super-admin.guard.middleware";
import { paginationAndSortingValidationWithEmailAndLogin } from "../../core/milldlewares/query-pagination-sorting-validation.middleware";

const userController = container.get(UserController);

export const userRouter = Router();

userRouter.use(basicAuth);

userRouter.get(
  "/",
  paginationAndSortingValidationWithEmailAndLogin,
  inputUsersValidationMiddleware,
  userController.findAllUsers,
);

userRouter.post(
  "/",
  loginValidation,
  passwordValidation,
  emailValidation,
  inputUsersValidationMiddleware,
  userController.createUser,
);

userRouter.delete("/:id", basicAuth, userController.delete);
