import { inject, injectable } from "inversify";

import { PostModelWithId, PostQuery, PostsDto } from "../posts.dto";
import { ObjectId } from "mongodb";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import { PostModel } from "./post.mongo";
import mongoose from "mongoose";

@injectable()
class PostsRepository {
  constructor(
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}


    // async createPost(newPost: PostsDto) {
    //     const blog = await this.blogsRepository.getBlogById(newPost.blogId);
    //     const post = PostModel.create_post_in_blog({ ...newPost, blogName: blog?.name });
    //     await post.save();
    //     return post;
    // }


    async getAllPosts(query: PostQuery) {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = query;

    const skip = (pageNumber - 1) * pageSize;
    const sortDir = sortDirection === "asc" ? 1 : -1;

    const result = await PostModel.find({})
      .sort({ [sortBy]: sortDir })
      .skip(+skip)
      .limit(+pageSize)
      .exec();

    // let resultWithId: {
    //   title: string;
    //   shortDescription: string;
    //   content: string;
    //   blogId: string;
    //   blogName: string;
    //   createdAt: string;
    //   id: string;
    // }[];
    // TODO refactoring resultWithId
    // resultWithId = result.map(({ _id, ...rest }) => ({
    //   ...rest,
    //   id: _id.toString(),
    // }));

    const totalCount = await PostModel.countDocuments({});

    return {
      pagesCount: +Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      // TODO refactoring resultWithId
      // items: resultWithId,
      items: result,
    };
  }

  async getPostById(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const result = await PostModel.findOne({ _id: new ObjectId(id) });
    if (!result) {
      return null;
    }
    return {
      ...result.toObject(),
      id: result._id.toString(),
    };
  }

  async deletePost(id: string) {
    const isDeleted = await PostModel.deleteOne({
      _id: new ObjectId(id),
    });
    return isDeleted.deletedCount !== 0;
  }

  async updatePost(id: string, post: PostModelWithId) {
    const updateFields: Partial<PostModelWithId> = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
    };

    if (post.blogName) {
      updateFields.blogName = post.blogName;
    }
    const isUpdated = await PostModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updateFields,
      },
    );
    return (await isUpdated.matchedCount) !== 0;
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

    const result = await PostModel.find({ blogId })
      .sort({ [sortBy]: sortDir })
      .skip(+skip)
      .limit(+pageSize)
      .exec();

    const totalCount = await PostModel.countDocuments({ blogId });

    return {
      pagesCount: +Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      // TODO postWithId refactoring
      // items: postWithId,
      items: result,
    };
  }
}

export default PostsRepository;
