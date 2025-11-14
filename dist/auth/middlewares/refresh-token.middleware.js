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
exports.verifyRefreshToken = exports.checkRefreshTokenMiddleware = void 0;
const http_status_code_1 = __importDefault(require("../../core/types/http-status-code"));
const jwt_adapter_1 = require("../adapters/jwt.adapter");
const checkRefreshTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rftoken = req.cookies.refreshToken;
    if (!rftoken) {
        res
            .status(http_status_code_1.default.UNAUTHORIZED_401)
            .send({ errorsMessages: "Unauthorized" });
        return;
    }
    else {
        next();
    }
});
exports.checkRefreshTokenMiddleware = checkRefreshTokenMiddleware;
const verifyRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rftoken = req.cookies.refreshToken;
    if (!rftoken) {
        res
            .status(http_status_code_1.default.UNAUTHORIZED_401)
            .send({ errorsMessages: "No refresh token provided" });
        return;
    }
    const verifyToken = yield jwt_adapter_1.jwtAdapter.verifyRefreshToken(rftoken);
    if (!verifyToken) {
        res
            .status(http_status_code_1.default.UNAUTHORIZED_401)
            .send({ errorsMessages: "Token is not verified or expired" });
        return;
    }
    next();
});
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=refresh-token.middleware.js.map