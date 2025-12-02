import { inject, injectable } from "inversify";

import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { UsersRepository } from "../repositories/users.repository";
import { UserCreateDto } from "../types/user-create-dto";
import { User } from "../types/user";
import { BcryptAdapter } from "../../auth/adapters/bcrypt.adapter";
import { UserMongooseModel } from "../domain/user.entity";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(BcryptAdapter) private bcryptAdapter: BcryptAdapter,
  ) {}
  async findMany(
    queryDto: PaginationAndSorting<"login" | "email" | "createdAt">,
  ): Promise<{ items: User[]; totalCount: number }> {
    return this.usersRepository.findMany(queryDto);
  }
  async create(dto: UserCreateDto): Promise<string> {
    const { login, password, email } = new UserMongooseModel(dto);

    const passwordHash = await this.bcryptAdapter.generateHash(password);

    const newUser = await UserMongooseModel.create({
      login,
      email,
      password: passwordHash,
    });

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
