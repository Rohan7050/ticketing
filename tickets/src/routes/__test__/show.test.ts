import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose"

jest.mock('../../nats-wrapper.ts')

it("return a 404 if ticket not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app)
    .get(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404);
});

it("return 200 if ticket with given id is found", async () => {
  const title = "new ticket";
  const price = 23;
  const res = await request(app)
    .post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);
  const ticket = await request(app)
    .get(`/api/tickets/${res.body.data.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200);

  expect(ticket.body.data.title).toEqual(title);
  expect(ticket.body.data.price).toEqual(price);
});
