import {UserResponseCreateDto} from "../types/user-response-create-dto";
import {getUserCollection} from "../../core/db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {UserDbDto} from "../types/user-db-dto";
import {IPagination, PaginationAndSortingUser} from "../../core/types/pagination-and-sorting";

export const usersQueryRepository = {
    async findAllUsers(sortQueryDto: PaginationAndSortingUser):  Promise<IPagination<UserResponseCreateDto[]>>{
        const { sortBy, sortDirection, pageSize, pageNumber, searchEmailTerm, searchLoginTerm } = sortQueryDto;
        const skip = (pageNumber - 1) * pageSize;
        const filter = this._getFilter(searchLoginTerm, searchEmailTerm)
        const totalCount = await getUserCollection().countDocuments(filter)
        const users = await getUserCollection()
            .find(filter)
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
    _getFilter(loginQuery: string | null, emailQuery: string | null): { login?: { $regex: string; $options: string }, email?: { $regex: string; $options: string } } {
        // let filter: { login?: { $regex: string; $options: string }, email?: { $regex: string; $options: string } } = {};

        const filters = [];

        if (loginQuery) {
            filters.push({ login: { $regex: loginQuery, $options: 'i' } });
        }
        if (emailQuery) {
            filters.push({ email: { $regex: emailQuery, $options: 'i' } });
        }

        if (filters.length === 0) {
            return {};
        }
        if (filters.length === 1) {
            return filters[0];
        }
        // @ts-ignore
        return { $or: filters };
    }
}