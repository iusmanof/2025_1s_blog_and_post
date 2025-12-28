import { inject, injectable } from "inversify";

import { PostModelWithId, PostQuery, PostsDto } from "../types/posts.dto";
import { ObjectId } from "mongodb";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import { PostModel } from "./post.mongo";
import { BlogModel } from "../../blogs/infrastructure/blog.mongo";
import mongoose from "mongoose";

@injectable()
class PostsRepository {
  constructor(
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: PostsDto) {
    if (!mongoose.isValidObjectId(dto.blogId)) {
      throw new Error("Blog not found");
    }

    const blogId = new mongoose.Types.ObjectId(dto.blogId);

    const blog = await BlogModel.findById(blogId);
    if (!blog) throw new Error("Blog not found");

    const post = PostModel.createPost({
      ...dto,
      blogId: dto.blogId,
      blogName: blog.name,
    });

    await post.save();
    return post;
  }

  async getAllPosts(query: PostQuery) {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = query;

    const skip = (pageNumber - 1) * pageSize;
    const sortDir = sortDirection === "asc" ? 1 : -1;

    const items = await PostModel.find({})
      .sort({ [sortBy]: sortDir })
      .skip(+skip)
      .limit(+pageSize)
      .exec();

    const totalCount = await PostModel.countDocuments({});

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  }

  async getPostById(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return PostModel.findById(id).exec();
  }

  async updatePost(id: string, post: PostModelWithId) {
    const result = await PostModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
        },
      },
    );

    return result.matchedCount === 1;
  }

  async deletePost(id: string) {
    const result = await PostModel.deleteOne({
      _id: new ObjectId(id),
    });

    return result.deletedCount === 1;
  }

  async deleteAllPosts() {
    await PostModel.deleteMany({});
  }

  async getPostByBlogId(blogId: string, query: PostQuery) {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = query;

    const skip = (pageNumber - 1) * pageSize;
    const sortDir = sortDirection === "asc" ? 1 : -1;

    const items = await PostModel.find({ blogId })
      .sort({ [sortBy]: sortDir })
      .skip(+skip)
      .limit(+pageSize)
      .exec();

    const totalCount = await PostModel.countDocuments({ blogId });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  }
}

export default PostsRepository;
