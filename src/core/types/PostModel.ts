export type PostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
};

export type PostModelWithId = PostModel & {
  id: string;
};

export type PostMongoDb = PostModel & {
  createdAt: string;
};

export type PostQuery = {
    sortBy?: string;
    sortDirection?: string;
    pageNumber?: number;
    pageSize?: number;
}

export type PostPromise = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostModel[]
}