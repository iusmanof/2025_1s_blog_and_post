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
exports.deleteUserHandler = deleteUserHandler;
const HttpStatusCode_1 = __importDefault(require("../../../core/types/HttpStatusCode"));
const users_service_1 = require("../../services/users.service");
const HttpStatusCode_2 = __importDefault(require("../../../core/types/HttpStatusCode"));
function deleteUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield users_service_1.usersService.delete(req.params.id);
        if (!user) {
            return res.status(HttpStatusCode_2.default.NOT_FOUND_404).send("Not Found");
        }
        return res.status(HttpStatusCode_1.default.NO_CONTENT_204).send("Deleted");
    });
}
//# sourceMappingURL=delete-user.handler.js.map