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
exports.accessTokenGuard = void 0;
const http_status_code_1 = __importDefault(require("../core/types/http-status-code"));
const jwt_adapter_1 = require("./adapters/jwt.adapter");
const accessTokenGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        res.status(http_status_code_1.default.UNAUTHORIZED_401).send('Unauthorized');
        return;
    }
    const [type, token] = authHeader.split(' ');
    if (type !== "Bearer") {
        res.status(http_status_code_1.default.UNAUTHORIZED_401).send('Unauthorized');
        return;
    }
    try {
        const payload = yield jwt_adapter_1.jwtAdapter.verifyAccessToken(token);
        if (!payload || typeof payload === 'string' || !('id' in payload)) {
            res.status(http_status_code_1.default.UNAUTHORIZED_401).send("Unauthorized");
            return;
        }
        const decodedToken = yield jwt_adapter_1.jwtAdapter.decodeToken(token);
        if (!decodedToken ||
            (typeof decodedToken !== "string" && decodedToken.exp && decodedToken.exp * 1000 <= Date.now())) {
            res.status(http_status_code_1.default.UNAUTHORIZED_401).send("AT expired");
            return;
        }
        req.user = { id: payload.id };
        next();
    }
    catch (e) {
        res.status(http_status_code_1.default.UNAUTHORIZED_401).send("Token expired");
        return;
    }
});
exports.accessTokenGuard = accessTokenGuard;
//# sourceMappingURL=access-token.guard.js.map