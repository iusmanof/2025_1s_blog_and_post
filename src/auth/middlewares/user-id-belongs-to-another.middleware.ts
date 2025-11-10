import {Request, Response, NextFunction, RequestHandler} from "express";
import {jwtAdapter} from "../adapters/jwt.adapter";
import {securityDevicesQueryRepository} from "../repository/security-devices.query-repository";
import httpStatusCode from "../../core/types/http-status-code";

export const userIdBelongsToAnotherMiddleware: RequestHandler= async (req: Request, res: Response, next:NextFunction) => {
    const rftoken = req.cookies.refreshToken
    const targerDeviceId = req.params.deviceId
    const {id: decodedUserId } = await jwtAdapter.decodeToken(rftoken)
    const targetDevice = await securityDevicesQueryRepository.geByDeviceId(targerDeviceId)

    // DeviceId(url) not found if DB
    if (!targetDevice) {
        res.status(httpStatusCode.NOT_FOUND_404).json({test: "not found"})
        return
    }

    // UserId(url) not equal UserId(RefreshTOken)
    if (targetDevice?.userId !== decodedUserId){
        res.status(httpStatusCode.FORBIDDEN_403).send({ error: "Forbidden"})
        return
    }

    next()
}