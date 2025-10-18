import {Request, Response} from "express";



export async function createCommentHandler(req: Request, res: Response) {
    const a = req.body
    console.log(a)
    return res;
}