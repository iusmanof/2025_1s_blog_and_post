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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersHandler = getUsersHandler;
const sort_query_default_util_1 = require("../../../core/utils/sort-query-default.util");
const users_query_repository_1 = require("../../repositories/users.query.repository");
const HttpStatusCode_1 = __importDefault(require("../../../core/types/HttpStatusCode"));
function getUsersHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = req.query;
        const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = (0, sort_query_default_util_1.sortQueryFieldsUtil)(query);
        const users = yield users_query_repository_1.usersQueryRepository.findAllUsers({
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        });
        return res.status(HttpStatusCode_1.default.OK_200).send(users);
    });
}
//# sourceMappingURL=get-users.handler.js.map