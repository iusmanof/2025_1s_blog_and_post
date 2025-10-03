import { MongoClient } from 'mongodb'
import { BlogMongoDb } from "../model_types/BlogModel";
import dotenv from 'dotenv'
import {PostMongoDb} from "../model_types/PostModel";
dotenv.config()

const url: string | undefined = process.env.MONGODB_URI
const dbName: string | undefined= process.env.DB_NAME
console.log(url)
console.log(dbName)
console.log("process.env.MONGODB_URI" + process.env.MONGODB_URI)
console.log("process.env.DB_NAME" + process.env.DB_NAME)

if (!url) throw new Error("MONGODB_URI\n is not defined");

const client = new MongoClient(url)
export const blogCollection = client.db(dbName).collection<BlogMongoDb>('blogs')
export const postCollection = client.db(dbName).collection<PostMongoDb>('posts')

export const  runDB = async () =>{
    try {
        await client.connect();
        console.log("Connect successfully to server")
    } catch (e) {
        console.error("Don't connect to server")
        console.log(e)
        await client.close();
    }
}