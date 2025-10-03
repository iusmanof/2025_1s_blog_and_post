import {Request, Response, Router} from "express";
import {HTTP_STATUS} from "../StatusCode";
import {RequestWithParams} from "../model_types/RequestTypes";
import {PostModelWithId} from "../model_types/PostModel";
import {basicAuth} from "../auth";
import {FieldError} from "../model_types/FieldError";
import {titleValidation} from "../bodyValidation/titleValidation";
import {contentValidation} from "../bodyValidation/contentValidation";
import {shortDescriptionValidation} from "../bodyValidation/shortDescriptionValidation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {postAccessLayerMongoDB} from "../dataAccessLayer/post-data-access-layer-mongodb";

export const PostRouter = Router();

PostRouter.get("/", async (req, res) => {
    const result = await postAccessLayerMongoDB.getAllPosts();
    await res.status(HTTP_STATUS.OK_200).send(result)
})
PostRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const postFounded = await postAccessLayerMongoDB.getPostById(req.params.id);
    if (!postFounded) await res.status(HTTP_STATUS.NOT_FOUND_404).send("No posts found.")
    await res.status(200).json(postFounded)
})

PostRouter.post('/', basicAuth,
    [titleValidation, contentValidation, shortDescriptionValidation],
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const postCreated = await postAccessLayerMongoDB.createPost(req.body)
        const apiErrorMsg: FieldError[] = []
        if (!postCreated) {
            apiErrorMsg.push({message: "ID Not found", field: "id"})
            await res.status(HTTP_STATUS.NOT_FOUND_404).json({errorsMessages: apiErrorMsg});
        }
        await res.status(HTTP_STATUS.CREATED_201).json(postCreated)
    })

PostRouter.put('/:id', basicAuth,
    [titleValidation, contentValidation, shortDescriptionValidation],
    inputValidationMiddleware,
    async (req: Request, res: Response<PostModelWithId | {
        errorsMessages: FieldError[]
    }>) => {
        const postIsUpdated = await postAccessLayerMongoDB.updatePost(req.params.id, req.body)
        const apiErrorMsg: FieldError[] = []
        if (!postIsUpdated) {
            apiErrorMsg.push({message: "ID Not found", field: "id"})
            return await res.status(HTTP_STATUS.NOT_FOUND_404).json({errorsMessages: apiErrorMsg});
        }
        return await res.status(HTTP_STATUS.NO_CONTENT_204).send()
    })
PostRouter.delete('/:id', basicAuth, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const post = await postAccessLayerMongoDB.deletePost(req.params.id)
    if (!post) await res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found")
    await res.status(HTTP_STATUS.NO_CONTENT_204).send()
})

