import dotenv from "dotenv";

dotenv.config();

export const SETTINGS = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    DB_NAME: process.env.DB_NAME || 'testDB',
    DB_COLLECTION_BLOGS: process.env.DB_COLLECTION_BLOGS || 'blogs',
    DB_COLLECTION_POSTS: process.env.DB_COLLECTION_BLOGS || 'posts',
}