import {Collection, MongoClient} from "mongodb";
import {PostMongoDb} from "../types/PostModel";
import {BlogMongoDb} from "../types/BlogModel";
import {SETTINGS} from "../settings/settings";
import {UserDbDto} from "../../users/types/user-db-dto";

let client: MongoClient;
let blogCollection: Collection<BlogMongoDb>;
let postCollection: Collection<PostMongoDb>;
let userCollection: Collection<UserDbDto>;

export const runDB = async (url: string) => {
    client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(SETTINGS.DB_NAME);
        blogCollection = db.collection<BlogMongoDb>(SETTINGS.DB_COLLECTION_BLOGS);
        postCollection = db.collection<PostMongoDb>(SETTINGS.DB_COLLECTION_POSTS);
        userCollection = db.collection<UserDbDto>(SETTINGS.DB_COLLECTION_USERS);
        console.log("Connect successfully to server");
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

export async function stopDb() {
    if (!client) {
        throw new Error(`No active client`);
    }
    await client.close();
}