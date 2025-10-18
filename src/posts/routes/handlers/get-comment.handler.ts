import {Request, Response} from "express";

export async function getCommentHandler(request: Request, response: Response) {
    const a = request.body
console.log(a)
    return response;
}