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
exports.PostModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const like_1 = require("../../comments/types/like");
const postSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "blog",
        required: true,
    },
    blogName: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    reactions: [
        {
            userId: { type: String, required: true },
            login: { type: String, required: true },
            status: {
                type: String,
                enum: Object.values(like_1.LikeStatus),
                required: true,
            },
            addedAt: { type: Date, required: true },
        },
    ],
}, {
    timestamps: { createdAt: true, updatedAt: false },
    optimisticConcurrency: true,
});
postSchema.methods.setLikeStatus = function (userId, login, likeStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingReaction = this.reactions.find((r) => r.userId === userId);
        if (existingReaction) {
            existingReaction.status = likeStatus;
            existingReaction.addedAt = new Date();
        }
        else {
            this.reactions.push({
                userId,
                login,
                status: likeStatus,
                addedAt: new Date(),
            });
        }
        this.likesCount = this.reactions.filter((r) => r.status === like_1.LikeStatus.Like).length;
        this.dislikesCount = this.reactions.filter((r) => r.status === like_1.LikeStatus.Dislike).length;
        yield this.save();
        return likeStatus;
    });
};
postSchema.methods.getExtendedLikesInfo = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const myReaction = this.reactions.find((r) => r.userId === userId);
        const newestLikes = this.reactions
            .filter((r) => r.status === like_1.LikeStatus.Like)
            .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
            .slice(0, 3)
            .map((r) => ({
            userId: r.userId,
            login: r.login,
            addedAt: r.addedAt.toISOString(),
        }));
        return {
            likesCount: this.likesCount,
            dislikesCount: this.dislikesCount,
            myStatus: (_a = myReaction === null || myReaction === void 0 ? void 0 : myReaction.status) !== null && _a !== void 0 ? _a : like_1.LikeStatus.None,
            newestLikes,
        };
    });
};
postSchema.statics.createPost = function (params) {
    return new this(Object.assign(Object.assign({}, params), { blogId: new mongoose_1.default.Types.ObjectId(params.blogId), likesCount: 0, dislikesCount: 0, reactions: [] }));
};
exports.PostModel = (0, mongoose_1.model)("post", postSchema);
//# sourceMappingURL=post.mongo.js.map