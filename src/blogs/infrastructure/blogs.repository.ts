import {injectable} from "inversify";
import { BlogQuery, BlogResponseBody }  from "../blog";
import mongoose from "mongoose";
import {BlogDocument, BlogModel} from "./blog.mongo";
import {BlogEntity} from "../domain/blog.entity";

@injectable()
export class BlogsRepository {

    async save(blogEntity: BlogEntity): Promise<BlogDocument> {
        const blog = BlogModel.create_blog(blogEntity)

        await blog.save();
        return blog;
    }

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
        const filter = searchNameTerm
            ? {name: {$regex: searchNameTerm, $options: "i"}}
            : {};

        const blogs = await BlogModel
            .find(filter)
            .sort({[sortBy]: sortDir})
            .skip(skip)
            .limit(pageSize)
            .lean();

        const items = blogs.map(blog => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt.toISOString(),
            isMembership: blog.isMembership,
        }))

        const totalCount = await BlogModel.countDocuments(filter);

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items,
        };
    }

    async getBlogById(id: string): Promise<BlogEntity | null> {
        if (!mongoose.isValidObjectId(id)) {
            return null;
        }

        const doc = await BlogModel.findById(id).lean();
        if (!doc) return null;

        return BlogEntity.restore({
            id: doc._id.toString(),
            name: doc.name,
            description: doc.description,
            websiteUrl: doc.websiteUrl,
            isMembership: doc.isMembership,
        });
    }

    async deleteBlog(blog: BlogEntity) {
        if (!blog.getId()) return;
        await BlogModel.findByIdAndDelete(blog.getId());
    }

    async deleteAllBlogs() {
        return BlogModel.deleteMany({});
    }
}

// async getBlogById(id: string): Promise<BlogEntity | null> {
//     if (!mongoose.isValidObjectId(id)) return null;
//
// const doc = await BlogModel.findById(id);
// if (!doc) return null;
//
// // Восстанавливаем Domain Entity из документа
// return BlogEntity.restore({
//     id: doc._id.toString(),
//     name: doc.name,
//     description: doc.description,
//     websiteUrl: doc.websiteUrl,
//     isMembership: doc.isMembership,
// });
// }
//
