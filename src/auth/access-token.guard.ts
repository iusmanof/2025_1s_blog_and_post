import {NextFunction, Request, Response} from "express";
import httpStatusCode from "../core/types/http-status-code";
import {jwtAdapter} from "./adapters/jwt.adapter";

export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        res.status(httpStatusCode.UNAUTHORIZED_401).send('Unauthorized');
        return
    }

    const [type, token] = authHeader.split(' ');

    if (type !== "Bearer") {
        res.status(httpStatusCode.UNAUTHORIZED_401).send('Unauthorized');
        return
    }

    try {
        const payload = await jwtAdapter.verifyToken(token);
        if (!payload || typeof payload === 'string' || !('id' in payload)) {
            res.status(httpStatusCode.UNAUTHORIZED_401).send("Unauthorized");
            return
        }

        (req as any).user = {id: payload.id};
        next();
    } catch (e) {
        res.status(httpStatusCode.UNAUTHORIZED_401).send("Token expired");
        return
    }
}