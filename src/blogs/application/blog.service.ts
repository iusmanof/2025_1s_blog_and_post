import {inject, injectable} from "inversify";
import {BlogRequestBody, BlogMongoDb, BlogPresentation, BlogQuery, BlogWithId} from "../blog";
import {PostsDto} from "../../posts/posts.dto";
import {BlogsRepository} from "../infrastructure/blogs.repository";
import {BlogModel} from "../infrastructure/blog.mongo";
import {PostModel} from "../../posts/infrastructure/post.mongo";
import PostsRepository from "../../posts/infrastructure/posts.repository";
import {BlogEntity} from "../domain/blog.entity";

@injectable()
export class BlogService {
    constructor(
        @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
        @inject(PostsRepository) private readonly postsRepository: PostsRepository,
    ) {
    }

    async create(blogRequestBody: BlogRequestBody): Promise<BlogPresentation> {
        const blogEntity = new BlogEntity(blogRequestBody)
        const savedBlog = await this.blogsRepository.save(blogEntity);

        return {
            id: savedBlog.id,
            name: savedBlog.name,
            description: savedBlog.description,
            websiteUrl: savedBlog.websiteUrl,
            createdAt: savedBlog.createdAt,
            isMembership: savedBlog.isMembership,
        };
    }

    async findMany(query: BlogQuery) {
        return await this.blogsRepository.getAllBlogs(query);
    }

    async findById(id: string) {
        return await this.blogsRepository.getBlogById(id);
    }

    async update(id: string, blogRequestBody: BlogRequestBody) {
        const blogEntity = await this.blogsRepository.getBlogById(id);
        if (!blogEntity) return null;

        blogEntity.updateData(blogRequestBody)

        await this.blogsRepository.save(blogEntity);
        return true;
    }

    async delete(id: string): Promise<boolean> {
        const blogEntity = await this.blogsRepository.getBlogById(id);
        if (!blogEntity) return false;
        await this.blogsRepository.deleteBlog(blogEntity);
        return true;
    }


    async createPostByBlogId(postBody: PostsDto, blogId: string) {
        // TODO  BlogModel.findById(blogId); не используется напрмяую !!!
        const blog = await BlogModel.findById(blogId);
        if (!blog) return null;

        const post = PostModel.create_post_in_blog({
            title: postBody.title,
            shortDescription: postBody.shortDescription,
            content: postBody.content,
            blogId: String(blog._id),
            blogName: blog.name,
        });

        // await this.postsRepository.save(post);

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: blog._id.toString(),
            blogName: blog.name,
            // createdAt: post.createdAt.toISOString(),
        };
    }
}
