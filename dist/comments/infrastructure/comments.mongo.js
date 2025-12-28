"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentMongooseModel = exports.CommentReactionModel = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    postId: { type: String, required: true },
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    likesInfo: {
        likesCount: { type: Number, required: true, default: 0 },
        dislikesCount: { type: Number, required: true, default: 0 },
        myStatus: { type: String, default: "None" },
    },
}, { timestamps: { createdAt: true, updatedAt: false } });
commentSchema.methods.updateReaction = function (currentStatus, newStatus) {
    if (currentStatus === newStatus)
        return;
    if (currentStatus === "Like" && this.likesInfo.likesCount > 0)
        this.likesInfo.likesCount--;
    if (currentStatus === "Dislike" && this.likesInfo.dislikesCount > 0)
        this.likesInfo.dislikesCount--;
    if (newStatus === "Like")
        this.likesInfo.likesCount++;
    if (newStatus === "Dislike")
        this.likesInfo.dislikesCount++;
    this.likesInfo.myStatus = newStatus;
};
commentSchema.methods.setMyStatus = function (status) {
    this.likesInfo.myStatus = status;
};
commentSchema.statics.createFromEntity = function (entity) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = new this({
            postId: entity.postId,
            content: entity.content,
            commentatorInfo: { userId: entity.userId, userLogin: entity.userLogin },
            likesInfo: { likesCount: 0, dislikesCount: 0, myStatus: "None" },
        });
        yield comment.save();
        return comment;
    });
};
const commentReactionSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    commentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "comment", required: true },
    status: { type: String, required: true },
}, { timestamps: true });
commentReactionSchema.index({ userId: 1, commentId: 1 }, { unique: true });
exports.CommentReactionModel = (0, mongoose_1.model)("commentReaction", commentReactionSchema);
exports.CommentMongooseModel = (0, mongoose_1.model)("comment", commentSchema);
//# sourceMappingURL=comments.mongo.js.map