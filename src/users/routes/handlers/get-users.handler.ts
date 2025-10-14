import {Request, Response} from 'express';
import {UserResponseCreateDto} from "../../types/user-response-create-dto";
import {sortQueryFieldsUtil} from "../../../core/utils/sort-query-default.util";
import {usersQueryRepository} from "../../repositories/users.query.repository";
import httpStatusCode from "../../../core/types/HttpStatusCode";
import {IPagination, PaginationAndSortingUser} from "../../../core/types/pagination-and-sorting";


export async function getUsersHandler(
    req: Request,
    res: Response<IPagination<UserResponseCreateDto[]>>)
{
    const query = req.query as unknown as PaginationAndSortingUser;
    const {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchLoginTerm,
        searchEmailTerm
    } = sortQueryFieldsUtil(query);

    const users = await usersQueryRepository.findAllUsers({
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchLoginTerm,
        searchEmailTerm
    });

    return res.status(httpStatusCode.OK_200).send(users);
}