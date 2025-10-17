import {PaginationAndSorting} from "../../core/types/pagination-and-sorting";
import {usersRepository} from "../repositories/users.repository";
import {UserCreateDto} from "../types/user-create-dto";
import bcrypt from 'bcrypt';
import {UserDbDto} from "../types/user-db-dto";
import {bcryptAdapter} from "../../auth/adapters/bcrypt.adapter";

export const usersService = {
    async findMany(
        queryDto: PaginationAndSorting<'login' | 'email' | 'createdAt'>
    ): Promise<{ items: UserDbDto[], totalCount: number }>{
        return usersRepository.findMany(queryDto);
    },
    async create(dto: UserCreateDto): Promise<string> {
        const {login, password, email} = dto

        const passwordhash = await bcryptAdapter.generateHash(password);

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