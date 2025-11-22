import { inject, injectable } from "inversify";

import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { UsersRepository } from "../repositories/users.repository";
import { UserCreateDto } from "../types/user-create-dto";
import { UserDbDto } from "../types/user-db-dto";
import { BcryptAdapter } from "../../auth/adapters/bcrypt.adapter";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(BcryptAdapter) private bcryptAdapter: BcryptAdapter,
  ) {}
  async findMany(
    queryDto: PaginationAndSorting<"login" | "email" | "createdAt">,
  ): Promise<{ items: UserDbDto[]; totalCount: number }> {
    return this.usersRepository.findMany(queryDto);
  }
  async create(dto: UserCreateDto): Promise<string> {
    const { login, password, email } = dto;

    const passwordhash = await this.bcryptAdapter.generateHash(password);

    const newUser: UserDbDto = {
      login,
      email,
      password: passwordhash,
      createdAt: new Date(),
    };

    return await this.usersRepository.create(newUser);
  }
  async delete(id: string): Promise<boolean> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      return false;
    }
    return await this.usersRepository.delete(id);
  }
}

// export const usersService = {
//     async findMany(
//         queryDto: PaginationAndSorting<"login" | "email" | "createdAt">,
//     ): Promise<{ items: UserDbDto[]; totalCount: number }> {
//         return usersRepository.findMany(queryDto);
//     },
//     async create(dto: UserCreateDto): Promise<string> {
//         const { login, password, email } = dto;
//
//         const passwordhash = await bcryptAdapter.generateHash(password);
//
//         const newUser: UserDbDto = {
//             login,
//             email,
//             password: passwordhash,
//             createdAt: new Date(),
//         };
//
//         return await usersRepository.create(newUser);
//     },
//     async delete(id: string): Promise<boolean> {
//         const user = await usersRepository.findById(id);
//         if (!user) {
//             return false;
//         }
//         return await usersRepository.delete(id);
//     },
// };
