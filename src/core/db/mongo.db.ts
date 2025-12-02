import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { SETTINGS } from "./settings";

let client: MongoClient;

export const runDB = async (url: string) => {
  client = new MongoClient(url);

  try {
    await mongoose.connect(
      SETTINGS.MONGODB_URI + "/" + SETTINGS.DB_NAME_MONGOOSE,
    );
    console.log("Connect successfully to DB_NAME_MONGOOSE");
  } catch (e) {
    console.error("Don't connect to server");
    console.log(e);
    await client.close();
    await mongoose.disconnect();
    throw e;
  }
};

export async function stopDb() {
  if (!client) {
    throw new Error(`No active client`);
  }
  await client.close();
}
