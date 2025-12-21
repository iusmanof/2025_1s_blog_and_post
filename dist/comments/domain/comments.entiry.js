"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentMongooseModel = exports.CommentReactionModel = exports.likeInfoSchema = exports.commentatorInfoSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.commentatorInfoSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
}, { _id: false });
exports.likeInfoSchema = new mongoose_1.default.Schema({
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
}, { _id: false });
const commentSchema = new mongoose_1.default.Schema({
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    commentatorInfo: { type: exports.commentatorInfoSchema, required: true },
    likesInfo: { type: exports.likeInfoSchema, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
const commentReactionSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    commentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "comment", required: true },
    status: { type: String, required: true },
}, { timestamps: true });
commentReactionSchema.index({ userId: 1, commentId: 1 }, { unique: true });
exports.CommentReactionModel = (0, mongoose_1.model)("commentReaction", commentReactionSchema);
exports.CommentMongooseModel = (0, mongoose_1.model)("comment", commentSchema);
//# sourceMappingURL=comments.entiry.js.map