import {getBlogCollection} from "../../core/db/mongo.db";
import {BlogBase, BlogMongoDb, BlogQuery, BlogWithId} from "../../core/types/BlogModel";
import {ObjectId} from "mongodb";
import {PostModel} from "../../core/types/PostModel";
import {postsRepository} from "../../posts/repositories/posts.repository";


export const blogsRepository = {
        getAllBlogs: async (query: BlogQuery) => {
            const { pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection= 'desc', searchNameTerm} = query;

            const skip = (pageNumber - 1) * pageSize;
            const sortDir = sortDirection === 'asc' ? 1 : -1;
            const search =  searchNameTerm ? { name: {$regex: searchNameTerm, $options: "i" }} : {};

            const result = await getBlogCollection()
                .find(search)
                .sort({[sortBy]: sortDir})
                .skip(+skip)
                .limit(+pageSize)
                .toArray();

            // objectID
            const blogWithId: BlogWithId[] = result.map(({ _id, ...rest }) => ({
                ...rest,
                id: _id.toString(),
            }));
            // return await blogWithId;

            const totalCount = (await getBlogCollection().find(search).toArray()).length

            return {
                "pagesCount": +Math.ceil(totalCount / pageSize),
                "page": +pageNumber,
                "pageSize": +pageSize,
                "totalCount": +totalCount,
                "items": blogWithId
            };
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
  async  createPostByBlogId(body: PostModel, blogId: string) {
    return await postsRepository.createPostByBlogId(body, blogId);
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
