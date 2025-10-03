import express, {Request, Response} from "express";

import {BlogRouter} from "./routers/BlogRouters";
import {PostRouter} from "./routers/PostRouters";
import {runDB} from "./repositories/db";
import {blogDataAccessLayerMongoDB} from "./dataAccessLayer/blog-data-access-layer-mongodb";
import {postAccessLayerMongoDB} from "./dataAccessLayer/post-data-access-layer-mongodb";

const app = express()
const port = process.env.port || 3000

app.use(express.json());
app.use('/blogs', BlogRouter)
app.use('/posts', PostRouter)

app.get('/', async (req: Request, res: Response) => {
    await res.send('blogs api')
  })

app.delete('/testing/all-data', async (req: Request, res: Response) => {
  blogDataAccessLayerMongoDB.deleteAllBlogs()
  postAccessLayerMongoDB.deleteAllPosts()
  res.status(204).send("All data is deleted")
})

const startApp = async () => {
    await runDB();

    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}

startApp()

export default app;
