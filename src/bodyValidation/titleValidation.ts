import {body} from "express-validator"

export const titleValidation = body('title')
  .trim()
  .isString().withMessage('Param not a string')
  .isLength({min: 1, max: 30}).withMessage('Param is too long')
