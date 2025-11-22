import dotenv from "dotenv";
dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI:
    (process.env.MONGODB_URI as string) || "mongodb://localhost:27017",
  DB_NAME: (process.env.DB_NAME as string) || "testDB",
  MONGODB_URI_TEST_DBNAME:
    (process.env.MONGODB_URI_TEST_DBNAME as string) ||
    "mongodb://localhost:27017/test-DB",

  DB_COLLECTION_BLOGS: (process.env.DB_COLLECTION_BLOGS as string) || "blogs",
  DB_COLLECTION_POSTS: (process.env.DB_COLLECTION_POSTS as string) || "posts",
  DB_COLLECTION_USERS: (process.env.DB_COLLECTION_USERS as string) || "users",
  DB_COLLECTION_COMMENTS:
    (process.env.DB_COLLECTION_COMMENTS as string) || "comments",
  DB_COLLECTION_LIST_REFRESH_TOKEN:
    process.env.DB_COLLECTION_LIST_REFRESH_TOKEN || "list_refresh_token",
  DB_COLLECTION_SECURITY_LIMIT:
    (process.env.DB_COLLECTION_SECURITY_LIMIT as string) || "security_limit",
  DB_COLLECTION_SECURITY_DEVICES:
    (process.env.DB_COLLECTION_SECURITY_DEVICES as string) ||
    "security_devices",

  ACCESS_TOKEN_SECRET:
    (process.env.ACCESS_TOKEN_SECRET as string) || "ACCESS_TOKEN_SECRET",
  ACCESS_TOKEN_SECRET_TIME: Number(process.env.ACCESS_TOKEN_SECRET_TIME) || 10,
  REFRESH_TOKEN_SECRET:
    (process.env.ACCESS_TOKEN_SECRET as string) || "REFRESH_TOKEN_SECRET",
  REFRESH_TOKEN_SECRET_TIME:
    Number(process.env.ACCESS_TOKEN_SECRET_TIME) || 120,
};
