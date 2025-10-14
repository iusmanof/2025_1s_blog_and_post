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
exports.getBlogCollection = getBlogCollection;
exports.getPostCollection = getPostCollection;
exports.getUserCollection = getUserCollection;
exports.stopDb = stopDb;
const mongodb_1 = require("mongodb");
const settings_1 = require("../settings/settings");
let client;
let blogCollection;
let postCollection;
let userCollection;
const runDB = (url) => __awaiter(void 0, void 0, void 0, function* () {
    client = new mongodb_1.MongoClient(url);
    try {
        yield client.connect();
        const db = client.db(settings_1.SETTINGS.DB_NAME);
        blogCollection = db.collection(settings_1.SETTINGS.DB_COLLECTION_BLOGS);
        postCollection = db.collection(settings_1.SETTINGS.DB_COLLECTION_POSTS);
        userCollection = db.collection(settings_1.SETTINGS.DB_COLLECTION_USERS);
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
function getBlogCollection() {
    if (!blogCollection) {
        throw new Error("Collection blog not initialized");
    }
    return blogCollection;
}
function getPostCollection() {
    if (!postCollection) {
        throw new Error("Collection post not initialized");
    }
    return postCollection;
}
function getUserCollection() {
    if (!userCollection) {
        throw new Error("Collection user not initialized");
    }
    return userCollection;
}
function stopDb() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!client) {
            throw new Error(`No active client`);
        }
        yield client.close();
    });
}
//# sourceMappingURL=mongo.db.js.map