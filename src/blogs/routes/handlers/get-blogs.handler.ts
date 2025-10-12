import BlogService from "../../application/blog.service";
import HTTP_STATUS from "../../../core/types/HttpStatusCode";
import {RequestWithQuery} from "../../../core/types/RequestTypes";
import {BlogQuery} from "../../../core/types/BlogModel";
import {Response} from "express";

export async function getBlogsHandler(req: RequestWithQuery<BlogQuery>, res: Response) {
    const blogs = await BlogService.findMany(req.query);
    res.status(HTTP_STATUS.OK_200).send(blogs);
}