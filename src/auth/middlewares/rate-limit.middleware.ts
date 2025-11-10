import {Request, Response, NextFunction} from "express";
import httpStatusCode from "../../core/types/http-status-code";

interface RateLimitRecord {
    countLimit: number;
    firstRequestTime: number;
}

const rateLimits: Record<string, RateLimitRecord> = {};
const startCount = 1;

export const rateLimitMiddleware = ( limitRequest: number, timeRequest: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const url = req.url
        const nowTime = Date.now()
        let record = rateLimits[url];


        if (!record) {
            rateLimits[url] = {countLimit: startCount, firstRequestTime: nowTime};
            next()
            return
        }

        // 10 sec
        if (nowTime - record.firstRequestTime > timeRequest * 1000) {
            rateLimits[url] = {countLimit: startCount, firstRequestTime: nowTime};
            next()
            return
        }

        // 5 limit request
        if (record.countLimit >= limitRequest) {
            res.status(httpStatusCode.TOO_MANY_REQUESTS_429).json({ message: "Rate limit reached" });
            return
        }

        record.countLimit += 1
        next()
    }
}
