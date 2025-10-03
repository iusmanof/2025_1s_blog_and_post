"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuth = void 0;
const USERNAME = "admin";
const PASSWORD = "qwerty";
const basicAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return res.status(401).send("Unauthorized");
    }
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");
    if (username === USERNAME && password === PASSWORD) {
        return next();
    }
    res.status(401).send("Unauthorized");
};
exports.basicAuth = basicAuth;
