import {Request, Response} from "express";
import httpStatusCode from "../../../core/types/HttpStatusCode";
import {usersService} from "../../services/users.service";
import {UserCreateDto} from "../../types/user-create-dto";
import {UserResponseCreateDto} from "../../types/user-response-create-dto";
import {usersQueryRepository} from "../../repositories/users.query.repository";

export async function createUserHandler(
    req: Request<UserCreateDto>,
    res: Response<UserResponseCreateDto>) {

    const { login, password, email } = req.body;

    const userId = await usersService.create({ login, password, email });
    const newUser = await usersQueryRepository.findById(userId);

    return res.status(httpStatusCode.CREATED_201).send(newUser!);
}