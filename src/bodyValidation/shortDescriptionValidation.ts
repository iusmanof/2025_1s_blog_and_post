import {body} from "express-validator"

export const shortDescriptionValidation = body('shortDescription')
  .trim()
  .isString().withMessage('Param not a string')
  .isLength({min: 1, max: 100}).withMessage('Param is too long')
