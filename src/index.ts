import express from "express";
import {runDB} from "./core/db/mongo.db";
import {setupApp} from "./setup-app";
import {SETTINGS} from "./core/settings/settings";

const app = express();
const port = process.env.port || 3000;

setupApp(app)

const startApp = async () => {
    await runDB(SETTINGS.MONGODB_URI);

    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
};

startApp();

export default app;
