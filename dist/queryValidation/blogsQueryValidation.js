"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationAndSortingValidationWithSearchName = paginationAndSortingValidationWithSearchName;
exports.paginationAndSortingValidation = paginationAndSortingValidation;
const express_validator_1 = require("express-validator");
const DEFAULT_SEARCH_TERM = null;
const DEFAULT_SORT_BY = 'createdAt';
const DEFAULT_SORT_DIRECTION = 'desc';
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
function paginationAndSortingValidationWithSearchName() {
    return [
        (0, express_validator_1.query)('searchNameTerm')
            .optional()
            .default(DEFAULT_SEARCH_TERM)
            .isString()
            .trim(),
        ...paginationAndSortingValidation()
    ];
}
function paginationAndSortingValidation() {
    return [
        (0, express_validator_1.query)('sortBy')
            .optional()
            .default(DEFAULT_SORT_BY)
            .isString()
            .trim(),
        (0, express_validator_1.query)('sortDirection')
            .optional()
            .default(DEFAULT_SORT_DIRECTION)
            .isString()
            .trim(),
        (0, express_validator_1.query)('pageNumber')
            .optional()
            .default(DEFAULT_PAGE_NUMBER)
            .isNumeric(),
        (0, express_validator_1.query)('pageSize')
            .optional()
            .default(DEFAULT_PAGE_SIZE)
            .isNumeric(),
    ];
}
//# sourceMappingURL=blogsQueryValidation.js.map