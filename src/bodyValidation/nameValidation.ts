import {body} from "express-validator";

export const nameValidation = body('name')
  .trim()
  .isString().withMessage('Name must be string')
  .isLength({min: 1, max: 15}).withMessage('Name max length 15')
