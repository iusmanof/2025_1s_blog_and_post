import { getBlogCollection } from "../repositories/db";
import { BlogBase, BlogMongoDb, BlogWithId } from "../model_types/BlogModel";
import { ObjectId } from "mongodb";

export const blogDataAccessLayerMongoDB = {
   getAllBlogs: async () => {
    const result = await getBlogCollection().find({}).toArray();
    const blogWithId: BlogWithId[] = result.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));
    return await blogWithId;
  },
  async getBlogById(id: string) {
    const result = await getBlogCollection().findOne({ _id: new ObjectId(id) });
    if (!result) {
      return null;
    }
    const blogWIthId = [{ ...result }].map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));
    return blogWIthId[0];
  },
  async createBlog(blog: BlogBase) {
    const blogCreatedWithDate: BlogMongoDb = {
      name: blog.name!,
      description: blog.description!,
      websiteUrl: blog.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    const result = await getBlogCollection().insertOne({
      ...blogCreatedWithDate,
    });

    return {
      ...blogCreatedWithDate,
      id: result.insertedId.toString(),
    };
  },
  async updateBlog(id: string, blog: BlogBase) {
    const isUpdated = await getBlogCollection().updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
        },
      },
    );

    return isUpdated.matchedCount !== 0;
  },
  async deleteBlog(id: string) {
    const isDeleted = await getBlogCollection().deleteOne({
      _id: new ObjectId(id),
    });

    return isDeleted.deletedCount !== 0;
  },
  async deleteAllBlogs() {
    return await getBlogCollection().deleteMany({});
  },
};
