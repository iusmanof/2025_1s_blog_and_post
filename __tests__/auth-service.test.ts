import { MongoMemoryServer } from "mongodb-memory-server";
import { SETTINGS } from "../src/core/db/settings";
import { getUserCollection, runDB, stopDb } from "../src/core/db/mongo.db";
import { add } from "date-fns";
import { User } from "../src/users/types/user";
import { afterEach } from "node:test";
import { resultStatus } from "../src/core/types/result-object";
import { emailTemplate } from "../src/auth/application/adapters/email.template";

import { container } from "../src/composition.root";
import { AuthService } from "../src/auth/application/auth.service";
import { EmailAdapter } from "../src/auth/application/adapters/email.adapter";

jest.mock("../src/auth/application/adapters/email.adapter");
jest.mock("uuid", () => ({
  v4: () => "123456789",
}));

describe("Integration tests", () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    SETTINGS.DB_COLLECTION_USERS = "users";
    await runDB(mongoUri);
  });

  afterAll(async () => {
    await stopDb();
    await mongoServer.stop();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    const collecion = getUserCollection();
    await collecion.deleteMany();
  });

  it("MongoMemoryServer userCollection", async () => {
    const userCollection = getUserCollection();

    const newUser: User = {
      login: "login",
      email: "email@mail.com",
      password: "pass1234",
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: "1234",
        expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
        isConfirmed: false,
      },
    };
    await userCollection.insertOne(newUser);

    const found = await userCollection.findOne({ login: "login" });
    expect(found).toBeTruthy();
  });

  it("register user", async () => {
    const userEmail = "login1@mail.com";
    const userLogin = "login1";
    const userPassword = "pass1234";

    const mockEmailAdapter = {
      nodemailer: jest.fn().mockResolvedValue(true),
    };

    (await container.rebind(EmailAdapter)).toConstantValue(mockEmailAdapter);

    const authService = container.get(AuthService);

    const result = await authService.registerUser(
      userLogin,
      userEmail,
      userPassword,
    );

    expect(mockEmailAdapter.nodemailer).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      status: resultStatus.SUCCESS,
      extensions: [],
      data: "code send",
    });

    const userCollection = getUserCollection();
    const user = await userCollection.findOne({ login: "login1" });
    expect(user).toBeTruthy();

    const expectedTemplate = emailTemplate.registrationEmail(
      user!.emailConfirmation!.confirmationCode,
    );

    expect(mockEmailAdapter.nodemailer).toHaveBeenCalledWith(
      userEmail,
      expectedTemplate,
    );
  });
});
