import {Router, Request, Response} from "express";
import {RequestWithParams} from "../model_types/RequestTypes";
import {BlogWithId} from "../model_types/BlogModel";
import {basicAuth} from "../auth";
import {FieldError} from "../model_types/FieldError";
import {nameValidation} from "../bodyValidation/nameValidation";
import {websiteValidation} from "../bodyValidation/websiteValidation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {blogDataAccessLayerMongoDB} from "../dataAccessLayer/blog-data-access-layer-mongodb";
import {query} from "express-validator";
import HTTP_STATUS from "../HTTP_STATUS_enum/HttpStatusCode";

export const BlogRouter = Router();

BlogRouter.get("/",
    [
        query('searchNameTerm')
            .default(null),
        query('sortBy')
            .default('createdAt'),
        query('sortDirection')
            .default('desc'),
        query('pageNumber')
            .default(1),
        query('pageSize')
            .default(10)
    ]
    , async (req: Request, res: Response) => {
        const {
            searchNameTerm,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        } = req.query;

        console.log(searchNameTerm);
        console.log(sortBy);
        console.log(sortDirection);
        console.log(pageNumber);
        console.log(pageSize);

        const blogAll = await blogDataAccessLayerMongoDB.getAllBlogs();
        return await res.status(HTTP_STATUS.OK_200).send(blogAll);
    })
BlogRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const blogFounded = await blogDataAccessLayerMongoDB.getBlogById(req.params.id)
    if (!blogFounded) res.status(HTTP_STATUS.NOT_FOUND_404).send("Blog not found.")
    res.status(200).json(blogFounded)
})

BlogRouter.post('/', basicAuth,
    [
        nameValidation,
        websiteValidation,
    ],
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const blogCreated = await blogDataAccessLayerMongoDB.createBlog(req.body)
        return await res.status(HTTP_STATUS.CREATED_201).json(blogCreated);
    }
);

BlogRouter.put('/:id', basicAuth, [
        nameValidation,
        websiteValidation,
    ],
    inputValidationMiddleware,
    async (req: Request, res: Response<BlogWithId | {
        errorsMessages: FieldError[]
    }>) => {
        const blogIsUpdated = await blogDataAccessLayerMongoDB.updateBlog(req.params.id, req.body)
        const apiErrorMsg: FieldError[] = []
        if (!blogIsUpdated) {
            apiErrorMsg.push({message: "ID Not found", field: "id"})
            return await res.status(HTTP_STATUS.NOT_FOUND_404).json({errorsMessages: apiErrorMsg});
        }
        return await res.status(HTTP_STATUS.NO_CONTENT_204).send()
    })

BlogRouter.delete('/:id', basicAuth, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const blog = await blogDataAccessLayerMongoDB.deleteBlog(req.params.id)
    if (!blog) return await res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found")
    return await res.status(HTTP_STATUS.NO_CONTENT_204).send()
})
