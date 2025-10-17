import { validationResult } from "express-validator";
import {NextFunction, Request, Response} from "express";
import httpStatusCode from "../../types/HttpStatusCode";

export const usersInputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true }).map((err) => {
            return {
                message: err.msg,
                field: "path" in err ? err.path : err.type,
            };
        });
        res.status(httpStatusCode.BAD_REQUEST_400).send({ errorsMessages: errorsArray });
        return
    }
    next();
};
