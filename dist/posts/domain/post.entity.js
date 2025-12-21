"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostEntity = void 0;
class PostEntity {
    constructor(params) {
        this.title = params.title;
        this.shortDescription = params.shortDescription;
        this.content = params.content;
        this.blogId = params.blogId;
        this.blogName = params.blogName;
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
    setBlogName(blogName) {
        this.blogName = blogName;
    }
}
exports.PostEntity = PostEntity;
//# sourceMappingURL=post.entity.js.map