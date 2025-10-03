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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDB = exports.postCollection = exports.blogCollection = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const url = (_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : process.env.MONGODB_URI_DBNAME_LOCAL;
const dbName = (_b = process.env.DB_NAME) !== null && _b !== void 0 ? _b : "local";
if (!url)
    throw new Error("MONGODB_URI\n is not defined");
const client = new mongodb_1.MongoClient(url);
exports.blogCollection = client.db(dbName).collection('blogs');
exports.postCollection = client.db(dbName).collection('posts');
const runDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("Connect successfully to server");
    }
    catch (e) {
        console.error("Don't connect to server");
        console.log(e);
        yield client.close();
    }
});
exports.runDB = runDB;
