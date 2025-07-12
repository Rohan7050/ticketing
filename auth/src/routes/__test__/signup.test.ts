import request from "supertest";
import {app} from "../../app";

it("returns a 201 on successful signup", async () => {
    return await request(app)
    .post("/api/users/signup")
    .send({
        email: 'test@test.com',
        password: 'testing'
    })
    .expect(200);
})

it("returns a 400 on Invalid data", async () => {
    return request(app)
    .post("/api/users/signup")
    .send({
        email: 'test.com',
        password: 'testing'
    })
    .expect(400);
})

it("disallow duplicate emails", async () => {
    const response =  await request(app)
    .post("/api/users/signup")
    .send({
        email: 'test@test.com',
        password: 'testing'
    })
    .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
})