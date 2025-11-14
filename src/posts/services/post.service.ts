import { postsRepository } from "../repositories/posts.repository";
import {
  PostModel,
  PostModelWithId,
  PostQuery,
} from "../../core/types/PostModel";

const PostService = {
  findMany: async (query: PostQuery) => {
    return await postsRepository.getAllPosts(query);
  },
  findById: async (id: string) => {
    return await postsRepository.getPostById(id);
  },
  create: async (body: PostModel) => {
    return await postsRepository.createPost(body);
  },
  update: async (id: string, body: PostModelWithId) => {
    return await postsRepository.updatePost(id, body);
  },
  delete: async (id: string) => {
    return await postsRepository.deletePost(id);
  },
  findPostsByBlogId: async (blogId: string, query: PostQuery): Promise<any> => {
    return await postsRepository.getPostByBlogId(blogId, query);
  },
};

export default PostService;
