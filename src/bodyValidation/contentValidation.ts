import {body} from "express-validator"

export const contentValidation = body('content')
  .trim()
  .isString().withMessage('Param not a string')
  .isLength({min: 1, max: 1000}).withMessage('Param is too long')
