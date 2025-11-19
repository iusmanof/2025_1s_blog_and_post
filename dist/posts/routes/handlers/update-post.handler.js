"use strict";
// import { PostModelWithId } from "../../../core/types/PostModel";
// import { Request, Response } from "express";
// import HTTP_STATUS from "../../../core/types/http-status-code";
// import { FieldError } from "../../../core/types/FieldError";
// import PostService from "../../services/post.service";
//
// export async function updatePostHandler(
//   req: Request,
//   res: Response<
//     | PostModelWithId
//     | {
//         errorsMessages: FieldError[];
//       }
//   >,
// ) {
//   const postIsUpdated = await PostService.update(req.params.id, req.body);
//   const apiErrorMsg: FieldError[] = [];
//   if (!postIsUpdated) {
//     apiErrorMsg.push({ message: "ID Not found", field: "id" });
//
//     res.status(HTTP_STATUS.NOT_FOUND_404).json({ errorsMessages: apiErrorMsg });
//     return;
//   }
//   res.status(HTTP_STATUS.NO_CONTENT_204).send();
// }
//# sourceMappingURL=update-post.handler.js.map
