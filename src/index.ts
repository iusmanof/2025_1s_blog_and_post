import express from "express";
import {runDB} from "./core/db/mongo.db";
import {SETUP_APP} from "./setup-app";
import {SETTINGS} from "./core/settings/settings";

const app = express();
const port = process.env.port || 3000;

SETUP_APP(app)

const startApp = async () => {
    await runDB(SETTINGS.MONGODB_URI);

    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
};

startApp();

export default app;
