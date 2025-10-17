import {Request, Response, NextFunction} from "express";
import dotenv from "dotenv";

dotenv.config();

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "qwerty"

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"] as string;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
        res.status(401).send("Unauthorized");
        return
    }

    const base64Credentials: string = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        next();
        return
    }

    res.status(401).send("Unauthorized");
};
