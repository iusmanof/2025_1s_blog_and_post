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
const express_1 = __importDefault(require("express"));
const BlogRouters_1 = require("./routers/BlogRouters");
const PostRouters_1 = require("./routers/PostRouters");
const db_1 = require("./repositories/db");
const blog_data_access_layer_mongodb_1 = require("./dataAccessLayer/blog-data-access-layer-mongodb");
const post_data_access_layer_mongodb_1 = require("./dataAccessLayer/post-data-access-layer-mongodb");
const app = (0, express_1.default)();
const port = process.env.port || 3000;
app.use(express_1.default.json());
app.use('/blogs', BlogRouters_1.BlogRouter);
app.use('/posts', PostRouters_1.PostRouter);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield res.send('blogs api');
}));
app.delete('/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    blog_data_access_layer_mongodb_1.blogDataAccessLayerMongoDB.deleteAllBlogs();
    post_data_access_layer_mongodb_1.postAccessLayerMongoDB.deleteAllPosts();
    res.status(204).send("All data is deleted");
}));
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDB)();
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
});
startApp();
exports.default = app;
