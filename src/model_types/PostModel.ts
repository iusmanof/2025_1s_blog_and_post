export type PostModel = {
    title:	string
    shortDescription:	string
    content:	string
    blogId:	string
    blogName:	string
}

export type PostModelWithId = PostModel & {
    id:	string
}


export type PostMongoDb = PostModel & {
    createdAt: string
}