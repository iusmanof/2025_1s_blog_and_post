import {SortDirection} from "mongodb";

export type PaginationAndSorting<S> = {
    pageNumber: number;
    pageSize: number;
    sortBy: S;
    sortDirection: SortDirection;
};

export type PaginationAndSortingUser = {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: SortDirection;
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
};

export interface IPagination<I> {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: I
}