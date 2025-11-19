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
exports.userRouter = void 0;
const express_1 = require("express");
const super_admin_guard_middleware_1 = require("../../core/milldlewares/super-admin.guard-middleware");
const query_pagination_sorting_validation_middleware_1 = require("../../core/milldlewares/query-pagination-sorting.validation-middleware");
const password_validation_middleware_1 = require("../../core/milldlewares/password.validation-middleware");
const login_validation_middleware_1 = require("../../core/milldlewares/login.validation-middleware");
const email_validation_middleware_1 = require("../../core/milldlewares/email.validation-middleware");
const input_validation_middleware_1 = require("../../core/milldlewares/input-validation-middleware");
const users_input_validation_middleware_1 = require("../../core/milldlewares/users-input.validation-middleware");
const composition_root_1 = require("../../composition.root");
const http_status_code_1 = __importDefault(require("../../core/types/http-status-code"));
const sort_query_default_util_1 = require("../../core/utils/sort-query-default.util");
const http_status_code_2 = __importDefault(require("../../core/types/http-status-code"));
exports.userRouter = (0, express_1.Router)();
exports.userRouter.use(super_admin_guard_middleware_1.basicAuth);
exports.userRouter.get("/", super_admin_guard_middleware_1.basicAuth, (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidationWithEmailAndLogin)(), input_validation_middleware_1.inputValidationMiddleware, function getUsersHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = req.query;
        const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm, } = (0, sort_query_default_util_1.sortQueryFieldsUtil)(query);
        const users = yield composition_root_1.usersQueryRepository.findAllUsers({
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm,
        });
        return res.status(http_status_code_1.default.OK_200).send(users);
    });
});
exports.userRouter.post("/", super_admin_guard_middleware_1.basicAuth, login_validation_middleware_1.loginValidation, password_validation_middleware_1.passwordValidation, email_validation_middleware_1.emailValidation, users_input_validation_middleware_1.usersInputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password, email } = req.body;
    const userId = yield composition_root_1.usersService.create({ login, password, email });
    const newUser = yield composition_root_1.usersQueryRepository.findById(userId);
    return res.status(http_status_code_1.default.CREATED_201).send(newUser);
}));
exports.userRouter.delete("/:id", super_admin_guard_middleware_1.basicAuth, function deleteUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield composition_root_1.usersService.delete(req.params.id);
        if (!user) {
            return res.status(http_status_code_1.default.NOT_FOUND_404).send("Not Found");
        }
        return res.status(http_status_code_2.default.NO_CONTENT_204).send("Deleted");
    });
});
//# sourceMappingURL=users.route.js.map