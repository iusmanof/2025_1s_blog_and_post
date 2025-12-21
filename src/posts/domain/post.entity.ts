import { PostRequestBody } from "../post"; // Assuming PostRequestBody is another type that contains title, shortDescription, content, etc.

export class PostEntity {
    private readonly id: string | undefined
    private title: string
    private shortDescription: string
    private content: string
    private readonly blogId: string
    private blogName?: string


    constructor(params: { id?: string } & PostRequestBody ) {
        this.title = params.title;
        this.shortDescription = params.shortDescription;
        this.content = params.content;
        this.blogId = params.blogId;
        this.blogName = params.blogName;
    }

    static restore(params: { id: string } & PostRequestBody & { createdAt: Date; extendedLikesInfo: any; }): PostEntity {
        return new PostEntity(params);
    }

    updateData(params: PostRequestBody) {
        this.title = params.title;
        this.shortDescription = params.shortDescription;
        this.content = params.content;
    }

    toPrimitives() {
        return {
            title: this.title,
            shortDescription: this.shortDescription,
            content: this.content,
            blogId: this.blogId,
            blogName: this.blogName
        };
    }


    getId() { return this.id }
    getTitle() { return this.title }
    getShortDescription() { return this.shortDescription }
    getContent() { return this.content }
    getBlogId() { return this.blogId }

    setBlogName( blogName: string )  {
        this.blogName = blogName;
    }
}
