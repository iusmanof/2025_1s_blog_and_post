import {Request, Response} from "express";
import BlogService from "../../services/blog.service";
import HTTP_STATUS from "../../../core/types/HttpStatusCode";

export async function createBlogHandler (req: Request, res: Response)  {
    const blogCreated = await BlogService.create(req.body);
    return await res.status(HTTP_STATUS.CREATED_201).json(blogCreated);
}