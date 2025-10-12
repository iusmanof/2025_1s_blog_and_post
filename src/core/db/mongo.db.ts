import {Collection, MongoClient} from "mongodb";
import {PostMongoDb} from "../types/PostModel";
import {BlogMongoDb} from "../types/BlogModel";
import {SETTINGS} from "../settings/settings";

let client: MongoClient;
let blogCollection: Collection<BlogMongoDb>;
let postCollection: Collection<PostMongoDb>;

export const runDB = async (url: string) => {
    client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(SETTINGS.DB_NAME);
        blogCollection = db.collection<BlogMongoDb>(SETTINGS.DB_COLLECTION_BLOGS);
        postCollection = db.collection<PostMongoDb>(SETTINGS.DB_COLLECTION_POSTS);
        console.log("Connect successfully to server");
    } catch (e) {
        console.error("Don't connect to server");
        console.log(e);
        await client.close();
        throw e;
    }
};

export function getPostCollection() {
    if (!postCollection) throw new Error("Collection not initialized");
    return postCollection;
}

export function getBlogCollection() {
    if (!blogCollection) throw new Error("Collection not initialized");
    return blogCollection;
}

export async function stopDb() {
    if (!client) {
        throw new Error(`No active client`);
    }
    await client.close();
}