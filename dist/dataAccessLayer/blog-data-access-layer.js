"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogDataAccessLayer = void 0;
let blogsDB = [];
exports.blogDataAccessLayer = {
    getAllBlogs() {
        return blogsDB;
    },
    createBlog(blog) {
        const blogCreated = {
            id: Math.floor(Math.random() * 1000000).toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        };
        blogsDB = [...blogsDB, blogCreated];
        return blogCreated;
    },
    getBlogById(id) {
        let blogFounded;
        blogFounded = blogsDB.find(v => v.id === id);
        return blogFounded;
    },
    updateBlog(id, blog) {
        const blogID = blogsDB.findIndex(b => b.id === id);
        if (blogID === -1) {
            return false;
        }
        else {
            const blogUpdated = Object.assign(Object.assign({}, blogsDB[blogID]), { name: blog.name, description: blog.description, websiteUrl: blog.websiteUrl });
            blogsDB = [
                ...blogsDB.slice(0, blogID),
                blogUpdated,
                ...blogsDB.slice(blogID + 1)
            ];
            return true;
        }
    },
    deleteBlog(id) {
        const blogID = blogsDB.findIndex(v => v.id === id);
        if (blogID == -1) {
            return false;
        }
        else {
            blogsDB = blogsDB.filter(v => v.id !== id);
            return true;
        }
    },
    deleteAllBlogs() {
        blogsDB = [];
    }
};
