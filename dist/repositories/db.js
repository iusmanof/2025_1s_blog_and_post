"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDB = void 0;
exports.getPostCollection = getPostCollection;
exports.getBlogCollection = getBlogCollection;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
if (!url)
    throw new Error("MONGODB_URI is not defined");
if (!dbName)
    throw new Error("DB_NAME URL is not defined");
const client = new mongodb_1.MongoClient(url);
let blogCollection;
let postCollection;
const runDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const db = client.db(dbName);
        blogCollection = db.collection("blogs");
        postCollection = db.collection("posts");
        console.log("Connect successfully to server");
    }
    catch (e) {
        console.error("Don't connect to server");
        console.log(e);
        yield client.close();
    }
});
exports.runDB = runDB;
function getPostCollection() {
    if (!postCollection)
        throw new Error("Collection not initialized");
    return postCollection;
}
function getBlogCollection() {
    if (!blogCollection)
        throw new Error("Collection not initialized");
    return blogCollection;
}
