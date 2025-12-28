import { inject, injectable } from "inversify";
import { BlogRequestBody, BlogQuery } from "../types/blog";
import { PostsDto } from "../../posts/types/posts.dto";
import { BlogsRepository } from "../infrastructure/blogs.repository";
import PostsRepository from "../../posts/infrastructure/posts.repository";
import { BlogEntity } from "../domain/blog.entity";
import { mapPostToView } from "../../posts/application/post.mapper";

@injectable()
export class BlogService {
  constructor(
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
  ) {}

  async create(blogRequestBody: BlogRequestBody) {
    const blogEntity = new BlogEntity(blogRequestBody);
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

    blogEntity.updateData(blogRequestBody);

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
    const blog = await this.blogsRepository.getBlogById(blogId);
    if (!blog) return null;

    const post = await this.postsRepository.createPost({
      ...postBody,
      blogId: blog.getId()!,
      blogName: blog.getName(),
    });

    return mapPostToView(post);
  }
}
