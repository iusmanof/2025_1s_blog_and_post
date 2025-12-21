import { inject, injectable } from "inversify";

import { PostModelWithId, PostQuery } from "../posts.dto";
import { ObjectId } from "mongodb";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import { PostModel } from "./post.mongo";
import {PostEntity} from "../domain/post.entity";

@injectable()
class PostsRepository {
  constructor(
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}


    async createPost(newPost: PostEntity) {
        const blog = await this.blogsRepository.getBlogById(newPost.getBlogId());
        if (blog){
            newPost.setBlogName(blog.getName())
        } else {
            newPost.setBlogName("")
        }
        const post = PostModel.create_post_in_blog({ ...newPost.toPrimitives() });
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

    const result = await PostModel.find({})
      .sort({ [sortBy]: sortDir })
      .skip(+skip)
      .limit(+pageSize)
      .exec();

    const totalCount = await PostModel.countDocuments({});

    return {
      pagesCount: +Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
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
      items: result,
    };
  }
}

export default PostsRepository;
