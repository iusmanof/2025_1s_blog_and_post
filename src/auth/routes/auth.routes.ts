import {Request, Response, Router} from "express";
import {passwordValidation} from "../../core/milldlewares/validation/password.validation-middleware";
import {inputValidationMiddleware} from "../../core/milldlewares/validation/input-validation-middleware";
import {loginOrEmailValidation} from "../../core/milldlewares/validation/login-or-email.validation";
import {LoginOrEmailDto} from "../types/login-or-email.dto";
import httpStatusCode from "../../core/types/HttpStatusCode";
import {authService} from "../services/auth.service";
import {ResultStatus} from "../../core/types/result-object";
import {accessTokenGuard} from "../access-token.guard";
import {usersQueryRepository} from "../../users/repositories/users.query.repository";

export const authRouter = Router()

authRouter.post("/login",
    passwordValidation,
    loginOrEmailValidation,
    inputValidationMiddleware,
    async (req: Request<{}, LoginOrEmailDto>, res: Response) => {
        const {loginOrEmail, password} = req.body;

        const result = await authService.login(loginOrEmail, password);

        if (result.status === ResultStatus.ERROR || result.data === null) {
            res.status(httpStatusCode.UNAUTHORIZED_401).json(result);
            return;
        }
        res.status(httpStatusCode.OK_200).json({ accessToken: result.data.accessToken });
    });

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

authRouter.get("/me", accessTokenGuard, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.sendStatus(httpStatusCode.UNAUTHORIZED_401);
    }

    const me = await usersQueryRepository.findById(userId);
    if (!me) {
        return res.sendStatus(httpStatusCode.UNAUTHORIZED_401);
    }

    return res.status(httpStatusCode.OK_200).send(me);
});

