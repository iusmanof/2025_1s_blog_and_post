import { body } from "express-validator";
import { LikeStatus } from "../../types/like";

export const likeStatusValidation = body("likeStatus")
  .isString()
  .custom((v) => Object.values(LikeStatus).includes(v))
  .withMessage(
    `likeStatus must be one of: ${Object.values(LikeStatus).join(", ")}`,
  );
