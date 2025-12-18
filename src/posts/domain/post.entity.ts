import { PostRequestBody } from "../post"; // Assuming PostRequestBody is another type that contains title, shortDescription, content, etc.

export class PostEntity {
    private id?: string;
    private title: string;
    private shortDescription: string;
    private content: string;
    private blogId: string;
    private blogName: string;
    private extendedLikesInfo?: any; // You can define a more specific type for extendedLikesInfo if needed

    constructor(params: { id?: string } & PostRequestBody ) {
        this.id = params.id; // важно!
        this.title = params.title;
        this.shortDescription = params.shortDescription;
        this.content = params.content;
        this.blogId = params.blogId;
        this.blogName = params.blogName;
        this.extendedLikesInfo = params.extendedLikesInfo;
    }

    static restore(params: { id: string } & PostRequestBody & { createdAt: Date; extendedLikesInfo: any; }): PostEntity {
        return new PostEntity(params);
    }

    updateData(params: PostRequestBody) {
        this.title = params.title;
        this.shortDescription = params.shortDescription;
        this.content = params.content;
    }

    getId() { return this.id }
    getTitle() { return this.title }
    getShortDescription() { return this.shortDescription }
    getContent() { return this.content }
    getBlogId() { return this.blogId }
    getBlogName() { return this.blogName }
    getExtendedLikesInfo() { return this.extendedLikesInfo }
}
