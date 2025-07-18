import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken"

declare global {
  var signin: () => string[];
}
jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  jest.clearAllMocks();
  process.env.JWT_KEY = "dadmaw";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});


global.signin = () => {
    // creating psudo token
    const payload = {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: 'test@test.com'
    }
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = {jwt: token};
    const sessionJSON = JSON.stringify(session);
    const base64Str = Buffer.from(sessionJSON).toString('base64');
    return [`session=${base64Str}`];
}