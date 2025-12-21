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
exports.PostModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const postMethods = {
    test() {
    }
};
const postStaticMethods = {
    create_post_in_blog(params) {
        const post = new exports.PostModel({
            title: params.title,
            shortDescription: params.shortDescription,
            content: params.content,
            blogId: new mongoose_1.default.Types.ObjectId(params.blogId), // конвертация здесь
            blogName: params.blogName || "Unknown",
        });
        return post;
    },
};
const postSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "blog",
        required: true,
    },
}, {
    timestamps: true,
    optimisticConcurrency: true,
});
postSchema.methods = postMethods;
postSchema.statics = postStaticMethods;
exports.PostModel = (0, mongoose_1.model)("post", postSchema);
//# sourceMappingURL=post.mongo.js.map