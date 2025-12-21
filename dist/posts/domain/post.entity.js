"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostEntity = void 0;
class PostEntity {
    constructor(params) {
        this.title = params.title;
        this.shortDescription = params.shortDescription;
        this.content = params.content;
    }
    static restore(params) {
        return new PostEntity(params);
    }
    updateData(params) {
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
    getId() { return this.id; }
    getTitle() { return this.title; }
    getShortDescription() { return this.shortDescription; }
    getContent() { return this.content; }
    getBlogId() { return this.blogId; }
    getBlogName() { return this.blogName; }
    setBlogName(blogName) {
        this.blogName = blogName;
    }
    setBlogId(blogId) {
        this.blogId = blogId;
    }
}
exports.PostEntity = PostEntity;
//# sourceMappingURL=post.entity.js.map