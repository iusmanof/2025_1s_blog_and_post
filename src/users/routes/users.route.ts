import { container } from "../../composition.root";
import { UsersService } from "../services/users.service";

import { Request, Response, Router } from "express";
import { basicAuth } from "../../core/milldlewares/super-admin.guard-middleware";
import { paginationAndSortingValidationWithEmailAndLogin } from "../../core/milldlewares/query-pagination-sorting.validation-middleware";
import { passwordValidation } from "../../core/milldlewares/password.validation-middleware";
import { loginValidation } from "../../core/milldlewares/login.validation-middleware";
import { emailValidation } from "../../core/milldlewares/email.validation-middleware";
import { inputValidationMiddleware } from "../../core/milldlewares/input-validation-middleware";
import { usersInputValidationMiddleware } from "../../core/milldlewares/users-input.validation-middleware";
import { UserCreateDto } from "../types/user-create-dto";
import { UserResponseCreateDto } from "../types/user-response-create-dto";
import { usersQueryRepository } from "../../composition.root";
import httpStatusCode from "../../core/types/http-status-code";
import {
  IPagination,
  PaginationAndSortingUser,
} from "../../core/types/pagination-and-sorting";
import { sortQueryFieldsUtil } from "../../core/utils/sort-query-default.util";
import HttpStatusCode from "../../core/types/http-status-code";


export const userRouter = Router();
const usersService = container.get(UsersService);

userRouter.use(basicAuth);

userRouter.get(
  "/",
  basicAuth,
  paginationAndSortingValidationWithEmailAndLogin(),
  inputValidationMiddleware,
  async function getUsersHandler(
    req: Request,
    res: Response<IPagination<UserResponseCreateDto[]>>,
  ) {
    const query = req.query as unknown as PaginationAndSortingUser;
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = sortQueryFieldsUtil(query);

    const users = await usersQueryRepository.findAllUsers({
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    });

    return res.status(httpStatusCode.OK_200).send(users);
  },
);

userRouter.post(
  "/",
  basicAuth,
  loginValidation,
  passwordValidation,
  emailValidation,
  usersInputValidationMiddleware,
  async (req: Request<UserCreateDto>, res: Response<UserResponseCreateDto>) => {
    const { login, password, email } = req.body;

    const userId = await usersService.create({ login, password, email });
    const newUser = await usersQueryRepository.findById(userId);

    return res.status(httpStatusCode.CREATED_201).send(newUser!);
  },
);

userRouter.delete(
  "/:id",
  basicAuth,
  async function deleteUserHandler(
    req: Request<{ id: string }>,
    res: Response<string>,
  ) {
    const user = await usersService.delete(req.params.id);
    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND_404).send("Not Found");
    }
    return res.status(HttpStatusCode.NO_CONTENT_204).send("Deleted");
  },
);
