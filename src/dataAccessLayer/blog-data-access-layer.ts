import {BlogBase, BlogWithId} from "../model_types/BlogModel";

let blogsDB: BlogWithId[] = []

export const blogDataAccessLayer = {
  getAllBlogs(){
    return blogsDB;
  },
  createBlog (blog: BlogBase){
    const blogCreated: BlogWithId = {
      id: Math.floor(Math.random() * 1000000).toString(),
      name: blog.name!,
      description: blog.description!,
      websiteUrl: blog.websiteUrl,
    };
    blogsDB = [...blogsDB, blogCreated]
    return blogCreated
  },
  getBlogById(id: string): BlogWithId | undefined {
    let blogFounded: BlogWithId | undefined;
    blogFounded = blogsDB.find(v => v.id === id);
    return blogFounded
  },
  updateBlog(id: string, blog: BlogBase){
    const blogID = blogsDB.findIndex(b => b.id === id)

    if (blogID === -1) {
      return false
    } else {
      const blogUpdated: BlogWithId = {
        ...blogsDB[blogID],
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
      }
      blogsDB = [
        ...blogsDB.slice(0, blogID),
        blogUpdated,
        ...blogsDB.slice(blogID + 1)
      ]
      return true
    }
  },
  deleteBlog(id: string): boolean {
    const blogID = blogsDB.findIndex(v => v.id === id)

    if (blogID == -1){
      return false
    } else {
      blogsDB = blogsDB.filter(v => v.id !== id)
      return true
    }
  },
  deleteAllBlogs() {
    blogsDB = []
  }
}
