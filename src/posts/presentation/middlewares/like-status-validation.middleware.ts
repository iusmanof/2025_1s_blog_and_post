import { body } from "express-validator";
import { LikeStatus } from "../../../comments/types/like";

export const likeStatusValidationMiddleware = body("likeStatus")
  .isIn(Object.values(LikeStatus))
  .withMessage("Invalid likeStatus");
