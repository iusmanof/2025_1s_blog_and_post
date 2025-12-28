import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { BlogProps, BlogRequestBody } from "../types/blog";
import { BlogEntity } from "../domain/blog.entity";

export type BlogDocument = HydratedDocument<BlogProps, BlogMethods>;
type BlogMethods = typeof blogMethods;
type BlogStaticMethods = typeof blogStaticMethods;
type BlogModelType = Model<BlogProps, Record<string, never>, BlogMethods> &
  BlogStaticMethods;

const blogMethods = {
  updateData(params: BlogRequestBody) {
    (this as BlogDocument).name = params.name;
    (this as BlogDocument).description = params.description;
    (this as BlogDocument).websiteUrl = params.websiteUrl;
  },

  toggleMembership() {
    (this as BlogDocument).isMembership = !(this as BlogDocument).isMembership;
  },
};

const blogStaticMethods = {
  create_blog(blogParams: BlogEntity) {
    const newBlog = new BlogModel() as BlogDocument;
    newBlog.name = blogParams.getName();
    newBlog.description = blogParams.getDescription();
    newBlog.websiteUrl = blogParams.getWebsiteUrl();
    newBlog.isMembership = blogParams.getIsMembership();
    return newBlog;
  },
};

const blogSchema = new mongoose.Schema<BlogProps, BlogModelType, BlogMethods>(
  {
    name: { type: String, required: true, maxLength: 15 },
    description: { type: String, required: true, maxLength: 500 },
    websiteUrl: { type: String, required: true, maxLength: 100 },
    isMembership: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  },
);

blogSchema.methods = blogMethods;
blogSchema.statics = blogStaticMethods;

export const BlogModel = model<BlogProps, BlogModelType>("blog", blogSchema);
