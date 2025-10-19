import {body} from "express-validator";

export const commentValidationa= body('content')
        .trim()
        .isString()
        .isLength({min: 20, max: 300})
        .withMessage('Length must be at least 3 characters long')
