import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      login(): string[];
    }
  }
}

jest.mock("../nats-client");

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "test";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.login = () => {
  const json = JSON.stringify({
    jwt: jwt.sign(
      {
        id: mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com",
      },
      process.env.JWT_KEY!
    ),
  });

  return [`express:sess=${Buffer.from(json).toString("base64")}`];
};
