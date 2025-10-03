import {body} from "express-validator";

export const websiteValidation = body('websiteUrl')
  .isURL().withMessage('URL must be a valid URL')
