"use strict";
// import { Request, Response } from "express";
// import httpStatusCode from "../../../core/types/http-status-code";
// // import { usersService } from "../../services/users.service";
// import { UserCreateDto } from "../../types/user-create-dto";
// import { UserResponseCreateDto } from "../../types/user-response-create-dto";
// // import { usersQueryRepository } from "../../repositories/users.query.repositories";
// import {usersQueryRepository, usersService} from "../../../composition.root";
//
// export async function createUserHandler(
//   req: Request<UserCreateDto>,
//   res: Response<UserResponseCreateDto>,
// ) {
//   const { login, password, email } = req.body;
//
//   const userId = await usersService.create({ login, password, email });
//   const newUser = await usersQueryRepository.findById(userId);
//
//   return res.status(httpStatusCode.CREATED_201).send(newUser!);
// }
//# sourceMappingURL=create-user.handler.js.map