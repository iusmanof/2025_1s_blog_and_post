// POST
export type BlogRequestBody = {
    name: string;
    description: string;
    websiteUrl: string;
};

// GET
export type BlogQuery = {
    searchNameTerm?: string | null;
    sortBy?: string;
    sortDirection?: string;
    pageNumber?: number;
    pageSize?: number;
};

// GET, UPDATE by id
export type BlogResponseBody = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: Date
    isMembership: boolean
}







export type BlogMongoDb = BlogRequestBody & {
    id: string;
    createdAt: string;
    isMembership: boolean;
};

export type BlogPresentation = BlogRequestBody & {
    id: string;
    createdAt: Date;
    isMembership: boolean;
};

export type BlogWithId = BlogRequestBody & {
    id: string;
};

