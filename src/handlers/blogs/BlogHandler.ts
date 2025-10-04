import {blogDataAccessLayerMongoDB} from "../../dataAccessLayer/blog-data-access-layer-mongodb";
import HTTP_STATUS from "../../HTTP_STATUS_enum/HttpStatusCode";
import {Request, Response} from "express";
import {RequestWithParams} from "../../model_types/RequestTypes";

const BlogHandler = {
    GET:  async (req: Request, res: Response) => {
        const blogAll = await blogDataAccessLayerMongoDB.getAllBlogs();
        return await res.status(HTTP_STATUS.OK_200).send(blogAll);
    },
    GET_ID:  async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const blogFounded = await blogDataAccessLayerMongoDB.getBlogById(
            req.params.id,
        );
        if (!blogFounded)
            res.status(HTTP_STATUS.NOT_FOUND_404).send("Blog not found.");
        res.status(200).json(blogFounded);
    },
}

export default BlogHandler;