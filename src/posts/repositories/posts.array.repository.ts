import { PostModelWithId } from "../../core/types/PostModel";
import { blogsArrayRepository } from "../../blogs/repositories/blogs.array.repository";

let postsDB: PostModelWithId[] = [];

export const postAccessLayer = {
  getAllPosts: () => {
    return postsDB;
  },
  getPostById: (id: string) => {
    let postFounded: PostModelWithId | undefined;
    postFounded = postsDB.find((post) => post.id === id);
    return postFounded;
  },
  createPost: (post: PostModelWithId) => {
    const blog = blogsArrayRepository.getBlogById(post.blogId);
    const postCreated: PostModelWithId = {
      id: Math.floor(Math.random() * 1000000).toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog ? blog.name : "Unknown",
    };
    postsDB = [...postsDB, postCreated];
    return postCreated;
  },
  deletePost: (id: string) => {
    const postID = postsDB.findIndex((p) => p.id === id);

    if (postID === -1) {
      return false;
    } else {
      postsDB.splice(postID, 1);
      return true;
    }
  },
  updatePost: (id: string, post: PostModelWithId) => {
    const postID = postsDB.findIndex((p) => p.id === id);

    if (postID === -1) {
      return false;
    } else {
      const blog = blogsArrayRepository.getBlogById(post.blogId);
      const postUpdated: PostModelWithId = {
        ...postsDB[postID],
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: blog ? blog.name : "Unknown",
      };
      postsDB = [
        ...postsDB.slice(0, postID),
        postUpdated,
        ...postsDB.slice(postID + 1),
      ];

      return true;
    }
  },
  deleteAllPosts: () => {
    postsDB = [];
  },
};
