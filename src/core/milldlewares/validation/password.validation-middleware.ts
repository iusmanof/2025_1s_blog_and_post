import {body} from "express-validator";

export const passwordValidation = body("password")
    .isString()
    .trim()
    .isLength({min: 6, max: 20})
    .withMessage("Password is not correct");