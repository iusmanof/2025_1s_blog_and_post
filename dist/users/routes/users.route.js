"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
const query_pagination_sorting_validation_middleware_1 = require("../../core/milldlewares/validation/query-pagination-sorting.validation-middleware");
const get_users_handler_1 = require("./handlers/get-users.handler");
const create_user_handler_1 = require("./handlers/create-user.handler");
const delete_user_handler_1 = require("./handlers/delete-user.handler");
const password_validation_middleware_1 = require("../../core/milldlewares/validation/password.validation-middleware");
const login_validation_middleware_1 = require("../../core/milldlewares/validation/login.validation-middleware");
const email_validation_middleware_1 = require("../../core/milldlewares/validation/email.validation-middleware");
const input_validation_middleware_1 = require("../../core/milldlewares/validation/input-validation-middleware");
exports.userRouter = express_1.default.Router();
exports.userRouter.use(super_admin_guard_middleware_1.basicAuth);
exports.userRouter.get('/', super_admin_guard_middleware_1.basicAuth, (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidationWithEmailAndLogin)(), input_validation_middleware_1.inputValidationMiddleware, get_users_handler_1.getUsersHandler);
exports.userRouter.post('/', super_admin_guard_middleware_1.basicAuth, password_validation_middleware_1.passwordValidation, login_validation_middleware_1.loginValidation, email_validation_middleware_1.emailValidation, input_validation_middleware_1.inputValidationMiddleware, create_user_handler_1.createUserHandler);
exports.userRouter.delete('/:id', super_admin_guard_middleware_1.basicAuth, delete_user_handler_1.deleteUserHandler);
//# sourceMappingURL=users.route.js.map