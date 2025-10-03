export type BlogBase ={
  name:	string
  description:	string
  websiteUrl:	string
}

export type BlogMongoDb = BlogBase & {
    createdAt:	string
    isMembership: boolean
}

export type BlogWithId = BlogBase & {
    id: string
}
