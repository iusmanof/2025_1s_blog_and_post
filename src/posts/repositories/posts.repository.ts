import { inject, injectable } from "inversify";

import {
  PostModelWithId,
  PostQuery,
  PostsDto,
} from "../types/posts.dto";
import { ObjectId } from "mongodb";
import { BlogsRepository } from "../../blogs/repositories/blogs.repository";
import { PostMongooseModel } from "../domain/post.entity";

@injectable()
class PostsRepository {
  constructor(
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}

  async getAllPosts(query: PostQuery) {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = query;

    const skip = (pageNumber - 1) * pageSize;
    const sortDir = sortDirection === "asc" ? 1 : -1;

    const result = await PostMongooseModel.find({})
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

    const totalCount = await PostMongooseModel.countDocuments({});

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

    const result = await PostMongooseModel.findOne({ _id: new ObjectId(id) });
    if (!result) {
      return null;
    }
    return {
      ...result.toObject(),
      id: result._id.toString(),
    };
  }

  async createPost(post: PostsDto) {
    const blog = await this.blogsRepository.getBlogById(post.blogId);

    const postCreated = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog ? blog.name : "Unknown",
      createdAt: new Date().toISOString(),
    };
    // TODO fix _id
    return await PostMongooseModel.insertOne({ ...postCreated });
    // const result = await PostMongooseModel.insertOne({ ...postCreated });
    // return {
    //   ...postCreated,
    //   id: result.insertedId.toString(),
    // };
  }

  // TODO if dont use it delete it
  // async createPostByBlogId(post: PostsDto, blogId: string) {
  //   const blog = await this.blogsRepository.getBlogById(post.blogId);
  //
  //   const postCreated = {
  //     title: post.title,
  //     shortDescription: post.shortDescription,
  //     content: post.content,
  //     blogId: blogId,
  //     blogName: blog ? blog.name : "Unknown",
  //     createdAt: new Date().toISOString(),
  //   };
  //   const result = await getPostCollection().insertOne({ ...postCreated });
  //   return {
  //     ...postCreated,
  //     id: result.insertedId.toString(),
  //   };
  // }
  async deletePost(id: string) {
    const isDeleted = await PostMongooseModel.deleteOne({
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
    const isUpdated = await PostMongooseModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updateFields,
      },
    );
    return (await isUpdated.matchedCount) !== 0;
  }

  async deleteAllPosts() {
    await PostMongooseModel.deleteMany({});
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

    const result = await PostMongooseModel.find({ blogId })
      .sort({ [sortBy]: sortDir })
      .skip(+skip)
      .limit(+pageSize)
      .exec();

    // const postWithId: PostsDto[] = result.map(({ _id, ...rest }) => ({
    //   ...rest,
    //   id: _id.toString(),
    // }));

    const totalCount = await PostMongooseModel.countDocuments({ blogId });

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
