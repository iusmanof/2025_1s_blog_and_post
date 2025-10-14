import {PaginationAndSorting} from "../../core/types/pagination-and-sorting";
import {usersRepository} from "../repositories/users.repository";
import {UserCreateDto} from "../types/user-create-dto";
import bcrypt from 'bcrypt';
import {UserDbDto} from "../types/user-db-dto";

export const usersService = {
    async findMany(
        queryDto: PaginationAndSorting<'login' | 'email' | 'createdAt'>
    ): Promise<{ items: UserDbDto[], totalCount: number }>{
        return usersRepository.findMany(queryDto);
    },
    async create(dto: UserCreateDto): Promise<string> {
        const {login, password, email} = dto

        const salt = await bcrypt.genSalt(10);
        const passwordhash = await bcrypt.hash(password, salt);



        const newUser: UserDbDto = {
            login,
            email,
            passwordhash,
            createdAt: new Date(),
        }

        return await usersRepository.create(newUser)
    },
    async delete(id: string): Promise<boolean> {
        const user = await usersRepository.findById(id);
        if (!user) {
            return false;
        }
        return await usersRepository.delete(id)
    }
}