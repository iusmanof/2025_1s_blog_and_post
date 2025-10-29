import {MongoMemoryServer} from "mongodb-memory-server";
import {SETTINGS} from "../src/core/settings/settings";
import {getUserCollection, runDB, stopDb} from "../src/core/db/mongo.db";
import {add} from "date-fns";
import {UserDbDto} from "../src/users/types/user-db-dto";
import {afterEach} from "node:test";
import {emailAdapter} from "../src/auth/adapters/email.adapter";
import {authService} from "../src/auth/services/auth.service";
import {resultStatus} from "../src/core/types/result-object";
import {emailExampleTemplate} from "../src/core/types/email-example.template";

jest.mock('../src/auth/adapters/email.adapter');

describe("Integration tests",()=> {

    let mongoServer: MongoMemoryServer;
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()

        SETTINGS.DB_COLLECTION_USERS = 'users';
        await runDB(mongoUri);
    })

    afterAll(async () => {
        await stopDb()
        await mongoServer.stop()
    })

    afterEach( async () => {
        jest.clearAllMocks()
        const collecion = getUserCollection()
        await collecion.deleteMany()
    })

    it('MongoMemoryServer userCollection', async () => {
        const userCollection = getUserCollection();

        const newUser: UserDbDto = {
            login: "login",
            email: "email@mail.com",
            password: "pass1234",
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: "1234",
                expirationDate: add(new Date(), {hours: 1, minutes: 30}),
                isConfirmed: false
            }
        }
        await userCollection.insertOne(newUser);

        const found = await userCollection.findOne({ login: 'login' });
        expect(found).toBeTruthy();
    });

    it("register user",async () => {
        const userEmail = 'login1@mail.com';
        const userLogin = 'login1';
        const userPassword = 'pass1234';

        const mockSend = jest
            .spyOn(emailAdapter, 'nodemailer')
            .mockResolvedValueOnce(true);

        const result = await authService.registerUser(userLogin, userEmail, userPassword)

        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
            status: resultStatus.SUCCESS,
            extensions: [],
            data: "code send"
        })


        const userCollection = getUserCollection();
        const user = await userCollection.findOne({ login: 'login1' });
        expect(user).toBeTruthy()

        if (!user || !user.emailConfirmation) {
            throw new Error("User or emailConfirmation not found in DB");
        }

        const expectedTemplate = emailExampleTemplate.registrationEmail(
            user.emailConfirmation.confirmationCode
        );

        expect(mockSend).toHaveBeenCalledWith(userEmail, expectedTemplate);
    })
})