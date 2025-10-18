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
const HttpStatusCode_1 = __importDefault(require("../core/types/HttpStatusCode"));
const jwt_adapter_1 = require("./adapters/jwt.adapter");
const accessTokenGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        res.status(HttpStatusCode_1.default.UNAUTHORIZED_401);
        return;
    }
    const [type, token] = authHeader.split(' ');
    if (type !== "Bearer") {
        res.status(HttpStatusCode_1.default.UNAUTHORIZED_401);
        return;
    }
    const payload = yield jwt_adapter_1.jwtAdapter.verifyToken(token);
    if (!payload || typeof payload === 'string' || !('id' in payload)) {
        res.status(HttpStatusCode_1.default.UNAUTHORIZED_401);
        return;
    }
    req.user = { id: payload.id };
    console.log(req.user);
    next();
    return;
});
exports.accessTokenGuard = accessTokenGuard;
//# sourceMappingURL=access-token.guard.js.map