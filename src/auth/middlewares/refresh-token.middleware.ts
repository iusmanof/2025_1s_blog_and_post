import {Request, Response, NextFunction, RequestHandler} from "express";
import httpStatusCode from "../../core/types/http-status-code";
import {jwtAdapter} from "../adapters/jwt.adapter";

export const checkRefreshTokenMiddleware: RequestHandler = async (req, res, next) => {
    const rftoken = req.cookies.refreshToken

    if (!rftoken) {
        res.status(httpStatusCode.UNAUTHORIZED_401).send({errorsMessages: "Unauthorized"});
        return
    } else {
        next();
    }
};

export const isRefreshTokenExpire = async (req: Request, res: Response, next: NextFunction) => {
    const rftoken = req.cookies.refreshToken

    const decodedToken = await jwtAdapter.decodeToken(rftoken);

    // ?
    if (
        !decodedToken ||
        (typeof decodedToken !== "string" && decodedToken.exp && decodedToken.exp * 1000 <= Date.now())
    ) {
        res.status(httpStatusCode.UNAUTHORIZED_401).send({errorsMessages: "Token expired"});
        return
    } else {
        next();
    }
};