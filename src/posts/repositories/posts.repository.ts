import {
  PostsDto,
  PostModelWithId,
  PostPromise,
  PostQuery,
} from "../types/posts.dto";
import { getPostCollection } from "../../core/db/mongo.db";
import { ObjectId } from "mongodb";
import { blogsRepository } from "../../composition.root";

export class PostsRepository {
  async getAllPosts(query: PostQuery) {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = query;

    const skip = (pageNumber - 1) * pageSize;
    const sortDir = sortDirection === "asc" ? 1 : -1;

    const result = await getPostCollection()
      .find({})
      .sort({ [sortBy]: sortDir })
      .skip(+skip)
      .limit(+pageSize)
      .toArray();

    let resultWithId: {
      title: string;
      shortDescription: string;
      content: string;
      blogId: string;
      blogName: string;
      createdAt: string;
      id: string;
    }[];
    resultWithId = result.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));
    // return resultWithId;

    const totalCount = await getPostCollection().countDocuments({});

    return {
      pagesCount: +Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: resultWithId,
    };
  }
  async getPostById(id: string) {
    const result = await getPostCollection().findOne({ _id: new ObjectId(id) });
    if (!result) {
      return null;
    }
    const postWithId = [{ ...result }].map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));
    return postWithId[0];
  }
  async createPost(post: PostsDto) {
    const blog = await blogsRepository.getBlogById(post.blogId);

    const postCreated = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog ? blog.name : "Unknown",
      createdAt: new Date().toISOString(),
    };
    const result = await getPostCollection().insertOne({ ...postCreated });
    return {
      ...postCreated,
      id: result.insertedId.toString(),
    };
  }
  async createPostByBlogId(post: PostsDto, blogId: string) {
    const blog = await blogsRepository.getBlogById(post.blogId);

    const postCreated = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: blogId,
      blogName: blog ? blog.name : "Unknown",
      createdAt: new Date().toISOString(),
    };
    const result = await getPostCollection().insertOne({ ...postCreated });
    return {
      ...postCreated,
      id: result.insertedId.toString(),
    };
  }
  async deletePost(id: string) {
    const isDeleted = await getPostCollection().deleteOne({
      _id: new ObjectId(id),
    });
    return (await isDeleted.deletedCount) !== 0;
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
    const isUpdated = await getPostCollection().updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updateFields,
      },
    );
    return (await isUpdated.matchedCount) !== 0;
  }
  async deleteAllPosts() {
    await getPostCollection().deleteMany({});
  }
  async getPostByBlogId(
    blogId: string,
    query: PostQuery,
  ): Promise<PostPromise> {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = query;

    const skip = (pageNumber - 1) * pageSize;
    const sortDir = sortDirection === "asc" ? 1 : -1;

    const result = await getPostCollection()
      .find({ blogId })
      .sort({ [sortBy]: sortDir })
      .skip(+skip)
      .limit(+pageSize)
      .toArray();

    const postWithId: PostsDto[] = result.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));

    const totalCount = await getPostCollection().countDocuments({ blogId });

    const resultWithMeta = {
      pagesCount: +Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: postWithId,
    };

    return await resultWithMeta;
  }
}
