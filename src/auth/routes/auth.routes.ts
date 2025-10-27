import {Request, Response, Router} from "express";
import {passwordValidation} from "../../core/milldlewares/validation/password.validation-middleware";
import {inputValidationMiddleware} from "../../core/milldlewares/validation/input-validation-middleware";
import {loginOrEmailValidation} from "../../core/milldlewares/validation/login-or-email.validation";
import {LoginOrEmailDto} from "../types/login-or-email.dto";
import httpStatusCode from "../../core/types/http-status-code";
import {authService} from "../services/auth.service";
import {resultStatus} from "../../core/types/result-object";
import {accessTokenGuard} from "../access-token.guard";
import {usersQueryRepository} from "../../users/repositories/users.query.repository";
import {inputRegistrationValidationMiddleware} from "../middlewares/input-registration-validation.middleware";
import {
    loginRegistrationValidationMiddleware,
} from "../middlewares/login-registration.validation.middleware";
import {emailRegistrationValidationMiddleware} from "../middlewares/email-registration-validation.middleware";

export const authRouter = Router()

authRouter.post("/login",
    passwordValidation,
    loginOrEmailValidation,
    inputValidationMiddleware,
    async (req: Request<{}, LoginOrEmailDto>, res: Response) => {
        const {loginOrEmail, password} = req.body;

        const result = await authService.login(loginOrEmail, password);

        if (result.status === resultStatus.ERROR || result.data === null) {
            res.status(httpStatusCode.UNAUTHORIZED_401).json(result);
            return;
        }
        res.status(httpStatusCode.OK_200).json({ accessToken: result.data.accessToken });
    });

authRouter.get("/me", accessTokenGuard, async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
         res.sendStatus(httpStatusCode.UNAUTHORIZED_401);
        return
    }

    const me = await usersQueryRepository.findById(userId);
    if (!me) {
         res.sendStatus(httpStatusCode.UNAUTHORIZED_401);
        return
    }

    res.status(httpStatusCode.OK_200).send(me);
});

authRouter.post("/registration-confirmation", async(req: Request<{},{},{code: string}>, res: Response) => {
    const code = req.body.code;

    const result = await authService.confirmUser(code);


    if (result.status === resultStatus.BAD_REQUEST || result.status === resultStatus.CODE_EXPIRED) {
        res.status(httpStatusCode.BAD_REQUEST_400).json({ errorsMessages: result.extensions })
        return
    }


    res.sendStatus(httpStatusCode.NO_CONTENT_204);
})

authRouter.post("/registration",
    emailRegistrationValidationMiddleware,
    loginRegistrationValidationMiddleware,
    passwordValidation,
    inputRegistrationValidationMiddleware,
    async(req: Request, res: Response) => {
    const {login, email, password} = req.body


    const result =  await authService.registerUser(login, email, password)
    if (result.status === resultStatus.EXISTS) {
        res.status(httpStatusCode.BAD_REQUEST_400).json( { errorsMessages: result.extensions })
        return
    }

    res.sendStatus(httpStatusCode.NO_CONTENT_204)
})

authRouter.post("/registration-email-resending",
    async(req: Request, res: Response) => {
    const {email} = req.body

    const result  = await authService.resendCode(email)
    if (result.status === resultStatus.BAD_REQUEST || result.status ===  resultStatus.NOT_FOUND) {
        res.status(httpStatusCode.BAD_REQUEST_400).json( { errorsMessages: result.extensions })
        return
    }
    res.status(httpStatusCode.NO_CONTENT_204).send('resend')
})




