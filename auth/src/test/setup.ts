import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  var signin: () => Promise<string[] | undefined>;
}

let mongo: any;
beforeAll(async () => {
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


global.signin = async () => {
    const email = 'test@test.com';
    const password = 'test123';
    const res = await request(app)
    .post("/api/users/signup")
    .send({
        email,
        password
    })
    .expect(201);
    const cookie = res.get('Set-Cookie');
    return cookie;
}