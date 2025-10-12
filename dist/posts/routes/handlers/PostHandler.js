"use strict";
// import {Request, Response} from "express";
// import HTTP_STATUS from "../../../core/types/HttpStatusCode";
// import {RequestWithParams, RequestWithQuery} from "../../../core/types/RequestTypes";
// import {FieldError} from "../../../core/types/FieldError";
// import {PostModelWithId, PostQuery} from "../../../core/types/PostModel";
// import PostService from "../../application/post.service";
// const PostHandler = {
// GET: async (req: RequestWithQuery<PostQuery>, res: Response) => {
//     const result = await PostService.findMany(req.query)
//     return res.status(HTTP_STATUS.OK_200).send(result);
// },
// GET_ID: async (req: RequestWithParams<{ id: string }>, res: Response) => {
//     const postFounded = await PostService.findById(req.params.id)
//     if (!postFounded)
//         await res.status(HTTP_STATUS.NOT_FOUND_404).send("No posts found.");
//     await res.status(200).json(postFounded);
// },
// POST: async (req: Request<PostModel>, res: Response) => {
//     const postCreated = await PostService.create(req.body)
//     const apiErrorMsg: FieldError[] = [];
//     if (!postCreated) {
//         apiErrorMsg.push({ message: "ID Not found", field: "id" });
//         await res
//             .status(HTTP_STATUS.NOT_FOUND_404)
//             .json({ errorsMessages: apiErrorMsg });
//     }
//     await res.status(HTTP_STATUS.CREATED_201).json(postCreated);
// },
// PUT: async (
//     req: Request,
//     res: Response<
//         | PostModelWithId
//         | {
//         errorsMessages: FieldError[];
//     }
//     >,
// ) => {
//     const postIsUpdated = await PostService.update(req.params.id, req.body);
//     const apiErrorMsg: FieldError[] = [];
//     if (!postIsUpdated) {
//         apiErrorMsg.push({message: "ID Not found", field: "id"});
//         return await res
//             .status(HTTP_STATUS.NOT_FOUND_404)
//             .json({errorsMessages: apiErrorMsg});
//     }
//     return await res.status(HTTP_STATUS.NO_CONTENT_204).send();
// },
// DELETE: async (req: RequestWithParams<{ id: string }>, res: Response) => {
//     const post = await PostService.delete(req.params.id);
//     if (!post) await res.status(HTTP_STATUS.NOT_FOUND_404).send("Not found");
//     await res.status(HTTP_STATUS.NO_CONTENT_204).send();
// },
// }
// export default PostHandler;
//# sourceMappingURL=PostHandler.js.map