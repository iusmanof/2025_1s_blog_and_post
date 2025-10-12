import {TESTING_PATH} from "../../src/core/paths/paths";
import request from "supertest";
import { Express } from 'express';
import HttpStatusCode from "../../src/core/types/HttpStatusCode";

export async function clearDb(app: Express) {
    await  request(app)
        .delete(TESTING_PATH)
        .expect(HttpStatusCode.NO_CONTENT_204)
}


