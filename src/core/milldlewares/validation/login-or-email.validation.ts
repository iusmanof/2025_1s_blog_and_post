import {body} from "express-validator";

export const loginOrEmailValidation = body('loginOrEmail')
    .trim()
    .isString()
    .isLength({min: 3, max: 20})
    .withMessage('Invalid email or login ')