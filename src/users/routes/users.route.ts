import {Router} from "express";
import {basicAuth} from "../../core/milldlewares/super-admin.guard-middleware";
import {
    paginationAndSortingValidationWithEmailAndLogin
} from "../../core/milldlewares/validation/query-pagination-sorting.validation-middleware";
import {getUsersHandler} from "./handlers/get-users.handler";
import {createUserHandler} from "./handlers/create-user.handler";
import {deleteUserHandler} from "./handlers/delete-user.handler";
import {passwordValidation} from "../../core/milldlewares/validation/password.validation-middleware";
import {loginValidation} from "../../core/milldlewares/validation/login.validation-middleware";
import {emailValidation} from "../../core/milldlewares/validation/email.validation-middleware";
import {inputValidationMiddleware} from "../../core/milldlewares/validation/input-validation-middleware";
import {usersInputValidationMiddleware} from "../../core/milldlewares/validation/users-input.validation-middleware";

export const userRouter = Router();

userRouter.use(basicAuth);

userRouter.get('/',
    basicAuth,
    paginationAndSortingValidationWithEmailAndLogin(),
    inputValidationMiddleware,
    getUsersHandler
);

userRouter.post('/',
    basicAuth,
    loginValidation,
    passwordValidation,
    emailValidation,
    usersInputValidationMiddleware,
    createUserHandler
);

userRouter.delete('/:id',
    basicAuth,
    deleteUserHandler
);