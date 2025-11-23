import { inject, injectable } from "inversify";
import { UsersService } from "../services/users.service";
import { Request, Response } from "express";
import {
  IPagination,
  PaginationAndSortingUser,
} from "../../core/types/pagination-and-sorting";
import { UserResponseCreateDto } from "../types/user-response-create-dto";
import { sortQueryFieldsUtil } from "../../core/utils/sort-query-default.util";
import httpStatusCode from "../../core/types/http-status-code";
import { UsersQueryRepository } from "../repositories/users.query.repository";
import { UserCreateDto } from "../types/user-create-dto";
import HttpStatusCode from "../../core/types/http-status-code";

@injectable()
export class UserController {
  constructor(
    @inject(UsersService) private readonly usersService: UsersService,
    @inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  findAllUsers = async (
    req: Request,
    res: Response<IPagination<UserResponseCreateDto[]>>,
  ) => {
    const query = req.query as unknown as PaginationAndSortingUser;
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = sortQueryFieldsUtil(query);

    // TODO controller dont work with queryRepository
    const users = await this.usersQueryRepository.findAllUsers({
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    });

    return res.status(httpStatusCode.OK_200).send(users);
  };

  createUser = async (
    req: Request<UserCreateDto>,
    res: Response<UserResponseCreateDto>,
  ) => {
    const { login, password, email } = req.body;

    const userId = await this.usersService.create({ login, password, email });
    const newUser = await this.usersQueryRepository.findById(userId);

    return res.status(httpStatusCode.CREATED_201).send(newUser!);
  };

  delete = async (req: Request<{ id: string }>, res: Response<string>) => {
    const user = await this.usersService.delete(req.params.id);
    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND_404).send("Not Found");
    }
    return res.status(HttpStatusCode.NO_CONTENT_204).send("Deleted");
  };
}
