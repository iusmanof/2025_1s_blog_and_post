import {Request, Response, NextFunction} from "express";
import {ObjectId} from "mongodb";

export const paramIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { blogId } = req.params;

    if (!blogId || !ObjectId.isValid(blogId)) {
        return res.status(404).json({
            errors: [
                {
                    message: "Invalid blogId",
                    field: "blogId"
                }
            ]
        });
    }

    return next();
};

