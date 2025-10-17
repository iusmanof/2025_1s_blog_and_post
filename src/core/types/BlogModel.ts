export type BlogBase = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogMongoDb = BlogBase & {
  createdAt: string;
  isMembership: boolean;
};

export type BlogWithId = BlogBase & {
  id: string;
};

export type BlogQuery = {
    searchNameTerm?: string | null;
    sortBy?: string;
    sortDirection?: string;
    pageNumber?: number;
    pageSize?: number;
}