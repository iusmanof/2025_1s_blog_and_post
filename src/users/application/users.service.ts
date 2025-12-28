import { inject, injectable } from "inversify";

import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { UsersRepository } from "../infrastructure/users.repository";
import { UserCreateDto } from "../types/user-create-dto";
import { BcryptAdapter } from "../../auth/application/adapters/bcrypt.adapter";
import { UserEntity } from "../domain/user.entity";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(BcryptAdapter) private bcryptAdapter: BcryptAdapter,
  ) {}
  async findMany(
    queryDto: PaginationAndSorting<"login" | "email" | "createdAt">,
  ) {
    return this.usersRepository.findMany(queryDto);
  }

  async create(dto: UserCreateDto): Promise<string> {
    const passwordHash = await this.bcryptAdapter.generateHash(dto.password);
    const userEntity = new UserEntity({
      login: dto.login,
      email: dto.email,
      passwordHash: passwordHash,
    });

    return await this.usersRepository.create(userEntity);
  }
  async delete(id: string): Promise<boolean> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      return false;
    }
    return await this.usersRepository.delete(id);
  }
}
