"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SETTINGS = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    DB_NAME: process.env.DB_NAME || 'testDB',
    MONGODB_URI_TEST_DBNAME: process.env.MONGODB_URI_TEST_DBNAME || 'mongodb://localhost:27017/test-DB',
    DB_COLLECTION_BLOGS: process.env.DB_COLLECTION_BLOGS || 'blogs',
    DB_COLLECTION_POSTS: process.env.DB_COLLECTION_BLOGS || 'posts',
    DB_COLLECTION_USERS: process.env.DB_COLLECTION_BLOGS || 'users',
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET',
    ACCESS_TOKEN_SECRET_TIME: Number(process.env.ACCESS_TOKEN_SECRET_TIME) || 300,
};
//# sourceMappingURL=settings.js.map