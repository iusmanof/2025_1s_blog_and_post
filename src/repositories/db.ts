import {Collection, MongoClient} from 'mongodb'
import {PostMongoDb} from "../model_types/PostModel";
import { BlogMongoDb } from "../model_types/BlogModel";
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME

if (!url) throw new Error('MONGODB_URI is not defined')
if (!dbName) throw new Error('DB_NAME URL is not defined')

const client = new MongoClient(url)

let blogCollection: Collection<BlogMongoDb>
let postCollection: Collection<PostMongoDb>

export const runDB = async () =>{
    try {
        await client.connect();
        const db = client.db(dbName);
        blogCollection = db.collection<BlogMongoDb>('blogs')
        postCollection = db.collection<PostMongoDb>('posts')
        console.log("Connect successfully to server")
    } catch (e) {
        console.error("Don't connect to server")
        console.log(e)
        await client.close();
    }
}

export function getPostCollection() {
    if (!postCollection) throw new Error('Collection not initialized')
    return postCollection
}

export function getBlogCollection() {
    if (!blogCollection) throw new Error('Collection not initialized')
    return blogCollection
}



// import { MongoClient, Collection } from 'mongodb'
// import dotenv from 'dotenv'
//
// dotenv.config()
//
// const url = process.env.MONGODB_URI
// const dbName = process.env.DB_NAME
//
// if (!url) throw new Error('MONGODB_URI not defined')
// if (!dbName) throw new Error('DB_NAME not defined')
//
// const client = new MongoClient(url)
//
// let blogCollection: Collection<any>
//
// export async function runDB() {
//     try {
//         await client.connect()
//         console.log('✅ Connected to MongoDB')
//         const db = client.db(dbName)
//         blogCollection = db.collection('blogs')
//     } catch (error) {
//         console.error('❌ Failed to connect to MongoDB', error)
//         await client.close()
//     }
// }
//
// export function getBlogCollection() {
//     if (!blogCollection) throw new Error('Collection not initialized')
//     return blogCollection
// }
