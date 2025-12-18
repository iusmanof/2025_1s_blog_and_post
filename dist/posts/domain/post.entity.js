"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostEntity = void 0;
class PostEntity {
    constructor(params) {
        this.id = params.id; // важно!
        this.title = params.title;
        this.shortDescription = params.shortDescription;
        this.content = params.content;
        this.blogId = params.blogId;
        this.blogName = params.blogName;
        this.extendedLikesInfo = params.extendedLikesInfo;
    }
    static restore(params) {
        return new PostEntity(params);
    }
    updateData(params) {
        this.title = params.title;
        this.shortDescription = params.shortDescription;
        this.content = params.content;
    }
    getId() { return this.id; }
    getTitle() { return this.title; }
    getShortDescription() { return this.shortDescription; }
    getContent() { return this.content; }
    getBlogId() { return this.blogId; }
    getBlogName() { return this.blogName; }
    getExtendedLikesInfo() { return this.extendedLikesInfo; }
}
exports.PostEntity = PostEntity;
//# sourceMappingURL=post.entity.js.map