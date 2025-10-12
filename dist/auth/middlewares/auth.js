"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuth = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const USERNAME = "admin";
const PASSWORD = "qwerty";
const basicAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        res.status(401).send("Unauthorized");
        return;
    }
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");
    if (username === USERNAME && password === PASSWORD) {
        next();
    }
    res.status(401).send("Unauthorized");
    return;
};
exports.basicAuth = basicAuth;
//# sourceMappingURL=auth.js.map