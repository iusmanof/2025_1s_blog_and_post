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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDB = void 0;
exports.getPostCollection = getPostCollection;
exports.getBlogCollection = getBlogCollection;
const mongodb_1 = require("mongodb");
const settings_1 = require("../core/settings/settings");
const url = settings_1.SETTINGS.MONGODB_URI;
if (!url) {
    throw new Error("MONGODB_URI is not defined");
}
const client = new mongodb_1.MongoClient(url);
let blogCollection;
let postCollection;
const runDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const db = client.db(settings_1.SETTINGS.DB_NAME);
        blogCollection = db.collection(settings_1.SETTINGS.DB_COLLECTION_BLOGS);
        postCollection = db.collection(settings_1.SETTINGS.DB_COLLECTION_POSTS);
        console.log("Connect successfully to server");
    }
    catch (e) {
        console.error("Don't connect to server");
        console.log(e);
        yield client.close();
        throw e;
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
//# sourceMappingURL=mongo.db.js.map