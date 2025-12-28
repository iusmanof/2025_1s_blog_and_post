export type BlogProps = {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
};

export type BlogRequestBody = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogQuery = {
  searchNameTerm?: string | null;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type BlogWithId = BlogRequestBody & {
  id: string;
};
