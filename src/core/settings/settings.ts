import dotenv from "dotenv";

dotenv.config();

export const SETTINGS = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI as string || 'mongodb://localhost:27017',
    DB_NAME: process.env.DB_NAME as string || 'testDB',
    MONGODB_URI_TEST_DBNAME: process.env.MONGODB_URI_TEST_DBNAME as string || 'mongodb://localhost:27017/test-DB',
    DB_COLLECTION_BLOGS: process.env.DB_COLLECTION_BLOGS as string || 'blogs',
    DB_COLLECTION_POSTS: process.env.DB_COLLECTION_BLOGS as string || 'posts',
    DB_COLLECTION_USERS: process.env.DB_COLLECTION_BLOGS as string || 'users',
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string || 'ACCESS_TOKEN_SECRET',
    ACCESS_TOKEN_SECRET_TIME: Number(process.env.ACCESS_TOKEN_SECRET_TIME) || 300,
}