import {Router} from "express";
import {passwordValidation} from "../../core/milldlewares/validation/password.validation-middleware";
import {inputValidationMiddleware} from "../../core/milldlewares/validation/input-validation-middleware";
import {loginOrEmailValidation} from "../../core/milldlewares/validation/login-or-email.validation";
import {LoginOrEmailDto} from "../types/login-or-email.dto";
import httpStatusCode from "../../core/types/HttpStatusCode";
import {authService} from "../services/auth.service";
import {Request, Response} from "express";

export const authRouter = Router()

authRouter.post("/login",
    passwordValidation,
    loginOrEmailValidation,
    inputValidationMiddleware,
    async (req: Request<{}, LoginOrEmailDto>, res: Response) => {
        const {loginOrEmail, password} = req.body;

        const result = await authService.login(loginOrEmail, password);

        if (result !== true) {
            res.status(httpStatusCode.UNAUTHORIZED_401).json(result);
            return
        }
        res.status(httpStatusCode.NO_CONTENT_204).json("Login successfully");
    });

// authRouter.get("/me", async(req: Request, res: Response) => {
//
// })