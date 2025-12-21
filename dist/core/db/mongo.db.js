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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDB = void 0;
exports.stopDb = stopDb;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const settings_1 = require("./settings");
let client;
const runDB = (url) => __awaiter(void 0, void 0, void 0, function* () {
    client = new mongodb_1.MongoClient(url);
    try {
        yield mongoose_1.default.connect(settings_1.SETTINGS.MONGODB_URI + "/" + settings_1.SETTINGS.DB_NAME_MONGOOSE);
        console.log("Connect successfully to DB_NAME_MONGOOSE");
    }
    catch (e) {
        console.error("Don't connect to server");
        console.log(e);
        yield client.close();
        yield mongoose_1.default.disconnect();
        throw e;
    }
});
exports.runDB = runDB;
function stopDb() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!client) {
            throw new Error(`No active client`);
        }
        yield client.close();
    });
}
//# sourceMappingURL=mongo.db.js.map