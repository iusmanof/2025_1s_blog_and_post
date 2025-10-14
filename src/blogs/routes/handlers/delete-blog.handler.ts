import {RequestWithParams} from "../../../core/types/RequestTypes";
import {Response} from "express";
import {validationResult} from "express-validator";
import BlogService from "../../services/blog.service";
import HTTP_STATUS from "../../../core/types/HttpStatusCode";

export async function deleteBlogHandler  (req: RequestWithParams<{ id: string }>, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(404).json({ errors: errors.array() });
        return
    }


    const blog = await BlogService.delete(req.params.id)
    if (!blog){
        res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found");
        return
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).send();
}