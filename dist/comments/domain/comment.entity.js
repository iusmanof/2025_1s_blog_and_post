"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentEntity = void 0;
class CommentEntity {
    constructor(params) {
        this.userId = params.userId;
        this.postId = params.postId;
        this.content = params.content;
    }
    getUserId() {
        return this.userId;
    }
    getPostId() {
        return this.postId;
    }
    getContent() {
        return this.content;
    }
}
exports.CommentEntity = CommentEntity;
//# sourceMappingURL=comment.entity.js.map