import {NextFunction, Request, Response} from "express";
import httpStatusCode from "../core/types/HttpStatusCode";
import {jwtAdapter} from "./adapters/jwt.adapter";


interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

export const accessTokenGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        res.status(httpStatusCode.UNAUTHORIZED_401)
        return
    }

    const [type, token] = authHeader.split(' ');

    if (type !== "Bearer") {
        res.status(httpStatusCode.UNAUTHORIZED_401)
        return
    }


    const payload = await jwtAdapter.verifyToken(token);
    if (!payload || typeof payload === 'string' || !('id' in payload)) {
        res.status(httpStatusCode.UNAUTHORIZED_401)
        return
    }

    (req as any).user = {id: payload.id};

    console.log(req.user)
    next();
    return
}