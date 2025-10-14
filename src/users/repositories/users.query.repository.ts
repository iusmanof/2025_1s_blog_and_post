import {UserResponseCreateDto} from "../types/user-response-create-dto";
import {getUserCollection} from "../../core/db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {UserDbDto} from "../types/user-db-dto";
import {IPagination, PaginationAndSortingUser} from "../../core/types/pagination-and-sorting";

export const usersQueryRepository = {
    async findAllUsers(sortQueryDto: PaginationAndSortingUser):  Promise<IPagination<UserResponseCreateDto[]>>{
        const { sortBy, sortDirection, pageSize, pageNumber } = sortQueryDto;
        const skip = (pageNumber - 1) * pageSize;
        const loginAndEmailSearch = {};
        const totalCount = await getUserCollection().countDocuments()
        const users = await getUserCollection().find(loginAndEmailSearch)
            .sort({[sortBy]: sortDirection})
            .skip(+skip)
            .limit(+pageSize)
            .toArray();


        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: users.map((u) => this._getInView(u)),
        };

    },
    async findById(id: string): Promise<UserResponseCreateDto | null> {
        const user = await getUserCollection().findOne({ _id: new ObjectId(id) });
        if (!user){
            return null
        }
        return  this._getInView(user);
    },
    _getInView(user: WithId<UserDbDto>): UserResponseCreateDto {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt ? user.createdAt.toISOString() : null,
        };
    },
}