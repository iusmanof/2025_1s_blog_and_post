import {blogDataAccessLayerMongoDB} from "../../dataAccessLayer/blog-data-access-layer-mongodb";
import HTTP_STATUS from "../../HTTP_STATUS_enum/HttpStatusCode";
import {Request, Response} from "express";

const BlogHandler = {
    GET:  async (req: Request, res: Response) => {
        const blogAll = await blogDataAccessLayerMongoDB.getAllBlogs();
        return await res.status(HTTP_STATUS.OK_200).send(blogAll);
    }
}

export default BlogHandler;