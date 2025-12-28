"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const composition_root_1 = require("../../composition.root");
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const users_input_validation_middleware_1 = require("./middlewares/users-input.validation-middleware");
const email_validation_middleware_1 = require("../../auth/presentation/middlewares/email-validation.middleware");
const password_validation_middleware_1 = require("../../auth/presentation/middlewares/password-validation.middleware");
const login_validation_middleware_1 = require("./middlewares/login-validation-middleware");
const super_admin_guard_middleware_1 = require("../../core/milldlewares/super-admin.guard.middleware");
const query_pagination_sorting_validation_middleware_1 = require("../../core/milldlewares/query-pagination-sorting-validation.middleware");
const userController = composition_root_1.container.get(user_controller_1.UserController);
exports.userRouter = (0, express_1.Router)();
exports.userRouter.use(super_admin_guard_middleware_1.basicAuth);
exports.userRouter.get("/", query_pagination_sorting_validation_middleware_1.paginationAndSortingValidationWithEmailAndLogin, users_input_validation_middleware_1.inputUsersValidationMiddleware, userController.findAllUsers);
exports.userRouter.post("/", login_validation_middleware_1.loginValidation, password_validation_middleware_1.passwordValidation, email_validation_middleware_1.emailValidation, users_input_validation_middleware_1.inputUsersValidationMiddleware, userController.createUser);
exports.userRouter.delete("/:id", super_admin_guard_middleware_1.basicAuth, userController.delete);
//# sourceMappingURL=users.route.js.map