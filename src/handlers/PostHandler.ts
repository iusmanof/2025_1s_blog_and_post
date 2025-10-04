import {Request, Response} from "express";
import {postDataAccessLayerMongoDB} from "../dataAccessLayer/post-data-access-layer-mongodb";
import HTTP_STATUS from "../HTTP_STATUS_enum/HttpStatusCode";
import {RequestWithParams} from "../model_types/RequestTypes";
import {FieldError} from "../model_types/FieldError";
import {PostModel, PostModelWithId} from "../model_types/PostModel";
import PostService from "../services/PostService";

const PostHandler = {
    GET: async (req: Request, res: Response) => {
        const result = await PostService.findMany()
        return res.status(HTTP_STATUS.OK_200).send(result);
    },
    GET_ID: async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const postFounded = await PostService.findById(req.params.id)
        if (!postFounded)
            await res.status(HTTP_STATUS.NOT_FOUND_404).send("No posts found.");
        await res.status(200).json(postFounded);
    },
    POST: async (req: Request<PostModel>, res: Response) => {
        const postCreated = await PostService.create(req.body)
        const apiErrorMsg: FieldError[] = [];
        if (!postCreated) {
            apiErrorMsg.push({ message: "ID Not found", field: "id" });
            await res
                .status(HTTP_STATUS.NOT_FOUND_404)
                .json({ errorsMessages: apiErrorMsg });
        }
        await res.status(HTTP_STATUS.CREATED_201).json(postCreated);
    },
    PUT: async (
        req: Request,
        res: Response<
            | PostModelWithId
            | {
            errorsMessages: FieldError[];
        }
        >,
    ) => {
        const postIsUpdated = await PostService.update(req.params.id, req.body);
        const apiErrorMsg: FieldError[] = [];
        if (!postIsUpdated) {
            apiErrorMsg.push({message: "ID Not found", field: "id"});
            return await res
                .status(HTTP_STATUS.NOT_FOUND_404)
                .json({errorsMessages: apiErrorMsg});
        }
        return await res.status(HTTP_STATUS.NO_CONTENT_204).send();
    },
    DELETE: async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const post = await PostService.delete(req.params.id);
        if (!post) await res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found");
        await res.status(HTTP_STATUS.NO_CONTENT_204).send();
    },
}

export default PostHandler;