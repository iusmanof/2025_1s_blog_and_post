import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {Blog} from "../types/blog";

// TODO use it
export type BlogHydrateDocument = HydratedDocument<Blog>;
type BlogModel = Model<Blog>;

const blogSchema = new mongoose.Schema<Blog>(
  {
    name: { type: String, required: true, maxLength: 15 },
    description: { type: String, required: true, maxLength: 500 },
    websiteUrl: { type: String, required: true, maxLength: 100 },
    isMembership: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const BlogMongooseModel = model<Blog, BlogModel>("blog", blogSchema);


class BlogEntity{
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;

    private constructor(private blogParams: Blog) {
        this.name = blogParams.name;
        this.description = blogParams.description;
        this.websiteUrl = blogParams.websiteUrl;
        this.isMembership = blogParams.isMembership;
    }

    static async createBlog(blog: Blog) {
        return new BlogEntity(blog);
    }
}

new BlogMongooseModel()