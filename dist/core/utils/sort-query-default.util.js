"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortQueryFieldsUtil = void 0;
const sortQueryFieldsUtil = (query) => {
    const pageNumber = !isNaN(Number(query.pageNumber))
        ? Number(query.pageNumber)
        : 1;
    const pageSize = !isNaN(Number(query.pageSize))
        ? Number(query.pageSize)
        : 10;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortDirection = query.sortDirection === "asc" ? 1 : -1;
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
};
exports.sortQueryFieldsUtil = sortQueryFieldsUtil;
//# sourceMappingURL=sort-query-default.util.js.map