import {ResultObject, ResultStatus} from "../../core/types/result-object";
import {commentsRepository} from "../repositories/comments.repository";
import {commentsDataResultObject, commentsDBResultObject} from "../types/comments-data-result-object";
import {CommentsQuery} from "../types/comments-query";

export const commentsService = {
    async create(userId: string, postId: string, content: string): Promise<ResultObject<commentsDataResultObject | null>> {
        const commentsInfo = await commentsRepository.create(userId, postId, content)

        if (!commentsInfo) {
            return {
                status: ResultStatus.ERROR,
                errorMessages: 'Failed to create a comment',
                data: null,
                extensions: []
            }
        }
        return {
            status: ResultStatus.SUCCESS,
            extensions: [],
            data: commentsInfo
        }
    },
    async getCommentByPostId(postId: string, query: CommentsQuery): Promise<ResultObject<commentsDBResultObject | null>> {
        const comments = await commentsRepository.getCommentsByPostId(postId, query)
        if (!comments){
            return {
                status: ResultStatus.ERROR,
                errorMessages: 'Comments not found',
                data: null,
                extensions: []
            }
        }
        return {
            status: ResultStatus.SUCCESS,
            extensions: [],
            data: comments
        }
    },
    async getCommentById(commentId: string): Promise<ResultObject<commentsDataResultObject | null>> {
        const comment = await commentsRepository.getCommentById(commentId)
        if (!comment) {
            return {
                status: ResultStatus.ERROR,
                errorMessages: 'Failed to get a comment',
                data: null,
                extensions: []
            }
        }

        return {
            status: ResultStatus.SUCCESS,
            extensions: [],
            data: comment
        }
    },
    async deleteById(commentId: string): Promise<ResultObject<{} | null>> {
        const result = await commentsRepository.deleteById(commentId)
        if (!result) {
            return {
                status: ResultStatus.ERROR,
                errorMessages: 'Failed to delete a comment',
                data: null,
                extensions: []
            }
        }

        return {
            status: ResultStatus.SUCCESS,
            extensions: [],
            data: result
        }
    },
    async updateById(commentId: string, content: string): Promise<ResultObject<{} | null>> {
        const result = await commentsRepository.updateById(commentId, content)


        if (!result) {
            return {
                status: ResultStatus.ERROR,
                errorMessages: 'Failed to update a comment',
                data: null,
                extensions: []
            }
        }
        return {
            status: ResultStatus.SUCCESS,
            extensions: [],
            data: result
        }
    },
    async findById(){

    }

}