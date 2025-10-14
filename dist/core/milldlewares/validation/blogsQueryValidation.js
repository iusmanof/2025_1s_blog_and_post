"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationAndSortingValidation = paginationAndSortingValidation;
exports.paginationAndSortingValidationWithSearchName = paginationAndSortingValidationWithSearchName;
exports.paginationAndSortingValidationWithEmailAndLogin = paginationAndSortingValidationWithEmailAndLogin;
const express_validator_1 = require("express-validator");
const DEFAULT_SEARCH_TERM = null;
const DEFAULT_SORT_BY = 'createdAt';
const DEFAULT_SORT_DIRECTION = 'desc';
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SEARCH_LOGIN_TERM = null;
const DEFAULT_SEARCH_EMAIL_TERM = null;
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
function paginationAndSortingValidationWithEmailAndLogin() {
    return [
        (0, express_validator_1.query)('searchLoginTerm')
            .optional()
            .default(DEFAULT_SEARCH_LOGIN_TERM)
            .isString()
            .trim(),
        (0, express_validator_1.query)('searchEmailTerm')
            .optional()
            .default(DEFAULT_SEARCH_EMAIL_TERM)
            .isString()
            .trim(),
        ...paginationAndSortingValidation(),
    ];
}
//# sourceMappingURL=blogsQueryValidation.js.map