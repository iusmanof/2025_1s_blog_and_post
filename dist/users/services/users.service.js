"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
class UsersService {
    constructor(usersRepository, bcryptAdapter) {
        this.usersRepository = usersRepository;
        this.bcryptAdapter = bcryptAdapter;
    }
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersRepository.findMany(queryDto);
        });
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password, email } = dto;
            const passwordhash = yield this.bcryptAdapter.generateHash(password);
            const newUser = {
                login,
                email,
                password: passwordhash,
                createdAt: new Date(),
            };
            return yield this.usersRepository.create(newUser);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findById(id);
            if (!user) {
                return false;
            }
            return yield this.usersRepository.delete(id);
        });
    }
}
exports.UsersService = UsersService;
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
//# sourceMappingURL=users.service.js.map