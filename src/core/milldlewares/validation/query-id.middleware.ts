import {param} from "express-validator";

export const queryIdMiddleware = [
    param('id')
        .isMongoId()
        .withMessage("Invalid MongoId")
]
