import {PaginationAndSortingUser} from "../types/pagination-and-sorting";

export const sortQueryFieldsUtil = (query: PaginationAndSortingUser): PaginationAndSortingUser => {
    const pageNumber = !isNaN(Number(query.pageNumber))
        ? Number(query.pageNumber)
        : 1;
    const pageSize = !isNaN(Number(query.pageSize))
        ? Number(query.pageSize)
        : 10;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortDirection: 1 | -1 = query.sortDirection === "asc" ? 1 : -1;
    const searchLoginTerm = query.searchLoginTerm || null;
    const searchEmailTerm = query.searchEmailTerm || null;

    return {
        pageNumber,
        pageSize,
        sortDirection,
        sortBy,
        searchLoginTerm,
        searchEmailTerm
    };
}