import HttpStatusCode from "../../../core/types/HttpStatusCode";
import {usersService} from "../../services/users.service";
import {Request, Response} from "express";
import httpStatusCode from "../../../core/types/HttpStatusCode";

export async function deleteUserHandler(req: Request<{ id: string }>, res: Response<string>) {
    const user = await usersService.delete(req.params.id);
    if (!user) {
        return res.status(httpStatusCode.NOT_FOUND_404).send("Not Found");
    }
    return res.status(HttpStatusCode.NO_CONTENT_204).send("Deleted");
}