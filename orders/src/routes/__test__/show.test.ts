import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

jest.mock("../../nats-wrapper.ts");

it("fetches the order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 59,
  });
  await ticket.save();
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const res = await request(app)
    .get(`/api/orders/${order.data.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(res.body.data.id).toEqual(order.data.id);
});

it("return autherisation error if other user access order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 59,
  });
  await ticket.save();
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  const userTwo = global.signin();
  await request(app)
    .get(`/api/orders/${order.data.id}`)
    .set("Cookie", userTwo)
    .expect(401);
});
