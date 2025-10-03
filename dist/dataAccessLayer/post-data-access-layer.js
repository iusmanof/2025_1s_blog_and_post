"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAccessLayer = void 0;
const blog_data_access_layer_1 = require("./blog-data-access-layer");
let postsDB = [];
exports.postAccessLayer = {
    getAllPosts: () => {
        return postsDB;
    },
    getPostById: (id) => {
        let postFounded;
        postFounded = postsDB.find(post => post.id === id);
        return postFounded;
    },
    createPost: (post) => {
        const blog = blog_data_access_layer_1.blogDataAccessLayer.getBlogById(post.blogId);
        const postCreated = {
            id: Math.floor(Math.random() * 1000000).toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blog ? blog.name : "Unknown"
        };
        postsDB = [...postsDB, postCreated];
        return postCreated;
    },
    deletePost: (id) => {
        const postID = postsDB.findIndex(p => p.id === id);
        if (postID === -1) {
            return false;
        }
        else {
            postsDB.splice(postID, 1);
            return true;
        }
    },
    updatePost: (id, post) => {
        const postID = postsDB.findIndex(p => p.id === id);
        if (postID === -1) {
            return false;
        }
        else {
            const blog = blog_data_access_layer_1.blogDataAccessLayer.getBlogById(post.blogId);
            const postUpdated = Object.assign(Object.assign({}, postsDB[postID]), { title: post.title, shortDescription: post.shortDescription, content: post.content, blogId: post.blogId, blogName: blog ? blog.name : "Unknown" });
            postsDB = [
                ...postsDB.slice(0, postID),
                postUpdated,
                ...postsDB.slice(postID + 1)
            ];
            return true;
        }
    },
    deleteAllPosts: () => {
        postsDB = [];
    },
};
