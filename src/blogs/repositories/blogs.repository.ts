import { injectable } from "inversify";
import {
  BlogBase,
  BlogMongoDb,
  BlogQuery,
  BlogWithId,
} from "../types/blog.dto";
import { ObjectId } from "mongodb";
import { PostsDto } from "../../posts/types/posts.dto";
import { BlogMongooseModel } from "../domain/blog.entity";
import mongoose from "mongoose";

@injectable()
export class BlogsRepository {
  async getAllBlogs(query: BlogQuery) {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
      searchNameTerm,
    } = query;

    const skip = (pageNumber - 1) * pageSize;
    const sortDir = sortDirection === "asc" ? 1 : -1;
    const search = searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: "i" } }
      : {};

    const result = await BlogMongooseModel.find(search)
      .sort({ [sortBy]: sortDir })
      .skip(+skip)
      .limit(+pageSize)
      .exec();

    const blogWithId: BlogWithId[] = result.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));

    const totalCount = await BlogMongooseModel.find(search).countDocuments();

    return {
      pagesCount: +Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: blogWithId,
    };
  }
  async getBlogById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    const result = await BlogMongooseModel.findById(id).exec();
    if (!result) return null;

    const { _id, ...rest } = result.toObject();
    return { ...rest, id: _id.toString() };
  }
  async createBlog(blog: BlogBase) {
    const blogCreatedWithDate: BlogMongoDb = {
      name: blog.name!,
      description: blog.description!,
      websiteUrl: blog.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    const result = await BlogMongooseModel.create(blogCreatedWithDate);

    return {
      ...blogCreatedWithDate,
      id: result._id.toString(),
    };
  }
  async updateBlog(id: string, blog: BlogBase) {
    const isUpdated = await BlogMongooseModel.updateOne(
      { _id: id },
      {
        $set: {
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
        },
      },
    );

    return isUpdated.matchedCount > 0;
  }
  async createPostByBlogId(body: PostsDto, blogId: string) {
    const blog = await this.getBlogById(body.blogId);
    const postCreated = {
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: blogId,
      blogName: blog ? blog.name : "Unknown",
      createdAt: new Date().toISOString(),
    };
    // const result = await PostMongooseModel.insertOne({ ...postCreated });
    return {
      ...postCreated,
      // TODO Fix this problem
      id: "12312312321",
      // id: result.insertedId.toString(),
    };
  }
  async deleteBlog(id: string) {
    const isDeleted = await BlogMongooseModel.deleteOne({
      _id: new ObjectId(id),
    });

    return isDeleted.deletedCount !== 0;
  }
  async deleteAllBlogs() {
    return BlogMongooseModel.deleteMany({});
  }
}
