import {query} from "express-validator";

const DEFAULT_SEARCH_TERM = null
const DEFAULT_SORT_BY = 'createdAt'
const DEFAULT_SORT_DIRECTION = 'desc'
const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10

export function paginationAndSortingValidationWithSearchName() {
    return [
        query('searchNameTerm')
            .optional()
            .default(DEFAULT_SEARCH_TERM)
            .isString()
            .trim(),
        ...paginationAndSortingValidation()
    ]
}

export function paginationAndSortingValidation() {
    return [
        query('sortBy')
            .optional()
            .default(DEFAULT_SORT_BY)
            .isString()
            .trim(),
        query('sortDirection')
            .optional()
            .default(DEFAULT_SORT_DIRECTION)
            .isString()
            .trim(),
        query('pageNumber')
            .optional()
            .default(DEFAULT_PAGE_NUMBER)
            .isNumeric(),
        query('pageSize')
            .optional()
            .default(DEFAULT_PAGE_SIZE)
            .isNumeric(),
    ]
}