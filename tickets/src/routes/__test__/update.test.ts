import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

jest.mock("../../nats-wrapper.ts");

it("returns a 404 if provided id does not exists", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send();
  expect(res.status).toEqual(404);
});

it("returns a 401 if user not sign in", async () => {
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "testing one",
      price: 10,
    })
    .expect(201);

  const id = ticket.body.data.id;
  const res = await request(app).put(`/api/tickets/${id}`).send();
  expect(res.status).toEqual(401);
});

it("returns a 400 if user provide invalid data", async () => {
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "testing one",
      price: 10,
    })
    .expect(201);

  const id = ticket.body.data.id;
  const res = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    });
  expect(res.status).toEqual(400);
});

it("returns a 401 if user not own ticket", async () => {
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "testing one",
      price: 10,
    })
    .expect(201);

  const id = ticket.body.data.id;
  const res = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "testing one",
      price: 10,
    });
  expect(res.status).toEqual(401);
});

it("returns a 200 if user provide valid data", async () => {
  const newTitle = "title two";
  const newPrice = 35;
  const session = global.signin();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", session)
    .send({
      title: "testing one",
      price: 10,
    })
    .expect(201);

  const id = ticket.body.data.id;
  const res = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", session)
    .send({
      title: newTitle,
      price: newPrice,
    });
  expect(res.status).toEqual(200);
  expect(res.body.data.title).toEqual(newTitle);
  expect(res.body.data.price).toEqual(newPrice);
});

it("rejects update if ticket is reserved", async () => {
  const newTitle = "title two";
  const newPrice = 35;
  const session = global.signin();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", session)
    .send({
      title: "testing one",
      price: 10,
    })
    .expect(201);
    const ticketId = ticket.body.data.id
  const findTicket = await Ticket.findById(ticketId);
  findTicket!.set({
    orderId: new mongoose.Types.ObjectId().toHexString(),
  });
  await findTicket?.save();
  const res = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", session)
    .send({
      title: newTitle,
      price: newPrice,
    });
  expect(res.status).toEqual(400);
});
