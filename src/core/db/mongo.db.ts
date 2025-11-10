import {Collection, MongoClient} from "mongodb";
import {PostMongoDb} from "../types/PostModel";
import {BlogMongoDb} from "../types/BlogModel";
import {SETTINGS} from "../settings/settings";
import {UserDbDto} from "../../users/types/user-db-dto";
import {CommentDbDto} from "../../comments/types/comment-db-dto";
import {ListRefreshToken} from "../../auth/types/list-refresh-token";
import {SecurityDeviceDbDto} from "../../auth/types/security-device-db.dto";

let client: MongoClient;
let blogCollection: Collection<BlogMongoDb>;
let postCollection: Collection<PostMongoDb>;
let userCollection: Collection<UserDbDto>;
let commentCollection: Collection<CommentDbDto>;
let listRefreshTokenCollection: Collection<ListRefreshToken>;
let securityDevicesCollection: Collection<SecurityDeviceDbDto>;

export const runDB = async (url: string) => {
    client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(SETTINGS.DB_NAME);
        blogCollection = db.collection<BlogMongoDb>(SETTINGS.DB_COLLECTION_BLOGS);
        postCollection = db.collection<PostMongoDb>(SETTINGS.DB_COLLECTION_POSTS);
        userCollection = db.collection<UserDbDto>(SETTINGS.DB_COLLECTION_USERS);
        listRefreshTokenCollection = db.collection<ListRefreshToken>(SETTINGS.DB_COLLECTION_LIST_REFRESH_TOKEN);
        commentCollection = db.collection<CommentDbDto>(SETTINGS.DB_COLLECTION_COMMENTS);
        securityDevicesCollection = db.collection<SecurityDeviceDbDto>(SETTINGS.DB_COLLECTION_SECURITY_DEVICES);

        console.log("Connect successfully to server");

        // TTL refresh token black list
        // await listRefreshTokenCollection.dropIndex("createdAt_1");
        // await listRefreshTokenCollection.createIndex({createdAt: 1}, {expireAfterSeconds: 24})

    } catch (e) {
        console.error("Don't connect to server");
        console.log(e);
        await client.close();
        throw e;
    }
};

export function getBlogCollection() {
    if (!blogCollection) {
        throw new Error("Collection blog not initialized");
    }
    return blogCollection;
}

export function getPostCollection() {
    if (!postCollection) {
        throw new Error("Collection post not initialized");
    }
    return postCollection;
}

export function getUserCollection() {
    if (!userCollection) {
        throw new Error("Collection user not initialized");
    }
    return userCollection;
}

export function getCommentCollection() {
    if (!commentCollection) {
        throw new Error("Collection comment not initialized");
    }
    return commentCollection;
}

export function getRefreshTokenCollection() {
    if (!listRefreshTokenCollection) {
        throw new Error("Collection token not initialized");
    }
    return listRefreshTokenCollection;
}

export function getSecurityDeviceCollection() {
    if (!securityDevicesCollection) {
        throw new Error("Collection security-device not initialized");
    }
    return securityDevicesCollection;
}

export async function stopDb() {
    if (!client) {
        throw new Error(`No active client`);
    }
    await client.close();
}

