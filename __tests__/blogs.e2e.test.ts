import request from 'supertest';
import app from "../src/index";  // Правильный импорт
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import httpStatusCode from "../src/HTTP_STATUS_enum/HttpStatusCode";
import HttpStatusCode from "../src/HTTP_STATUS_enum/HttpStatusCode";  // Этот импорт нужно перенести сюда

dotenv.config();

const login = 'admin';
const password = 'qwerty';
const base64Credentials = Buffer.from(`${login}:${password}`).toString('base64');

const dbName = process.env.DB_NAME ?? 'local';
const MONGODB_URI_DBNAME = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;

const client = new MongoClient(MONGODB_URI_DBNAME);

beforeAll(async () => {
    await client.connect();
    await request(app).delete('/testing/all-data').expect(204);
});

afterAll(async () => {
    await client.close();
});

describe('/blogs', () => {
    it('POST /blogs UNAUTHORIZED', async () => {
        await request(app)
            .post('/blogs')
            .send({ name: ' ', description: '' })
            .expect(httpStatusCode.UNAUTHORIZED_401);
    });

    it('POST /blogs', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({ name: ' ', description: '' })
            .expect(httpStatusCode.BAD_REQUEST_400, {
                errorsMessages: [
                    { message: 'Name max length 15', field: 'name' },
                    { message: 'URL must be a valid URL', field: 'websiteUrl' },
                ],
            });

        const res = await request(app).get('/blogs');
        expect(res.statusCode).toBe(httpStatusCode.OK);
        expect(res.body).toEqual([]);
    });

    it('GET /blogs/id incorrect id', async () => {

        await request(app).get('/blogs/incorrectid').expect(HttpStatusCode.BAD_REQUEST_400);
    });

    it('GET /blogs/id correct id hex', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({ name: "name", websiteUrl: "https://websiteUrl.domd", description: "description" });

        await request(app).get('/blogs/123456789123456789123456').expect(HttpStatusCode.NOT_FOUND_404);
    });

    it('PUT /blogs/id incorrect data', async () => {
        const createdBlog = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({ name: "name", websiteUrl: "https://websiteUrl.domd", description: "description" });

        const blogId = createdBlog.body.id;

        await request(app)
            .put(`/blogs/${blogId}`)  // Исправил на правильный путь с использованием слэша
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({ name: "name", websiteUrl: "BAD URL", description: "description" })
            .expect(HttpStatusCode.BAD_REQUEST_400);
    });

    it('PUT /blogs/id correct data', async () => {
        const createdBlog = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({ name: "name", websiteUrl: "https://websiteUrl.domd", description: "description" });

        const blogId = createdBlog.body.id;

        await request(app)
            .put(`/blogs/${blogId}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({ name: "name", websiteUrl: "http://correct.url", description: "description" })
            .expect(HttpStatusCode.BAD_REQUEST_400);
    });

    it('DELETE /blogs/id incorrect id', async () => {
        await request(app)
            .delete('/blogs/INCORECT_ID')
            .set('Authorization', `Basic ${base64Credentials}`)
            .expect(HttpStatusCode.NOT_FOUND_404);
    });

    it('DELETE /blogs/id correct data', async () => {
        const createdBlog = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({ name: "name", websiteUrl: "https://websiteUrl.domd", description: "description" });

        const blogId = createdBlog.body.id;

        await request(app)
            .delete(`/blogs/${blogId}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .expect(HttpStatusCode.CREATED_201);
    });
});
