import request from "supertest";
import {app} from '../../app';
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

jest.mock('../../nats-wrapper.ts');

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 59
    });
    await ticket.save();
    return ticket;
}

it('fetches order for a particular user', async () => {
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    const {body: orderOne} = await request(app)
        .post("/api/orders")
        .set("Cookie", userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201);
    const {body: orderTwo} = await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201);
    const {body: orderThree} = await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201);

    const res = await request(app)
        .get("/api/orders")
        .set("Cookie", userTwo)
        .expect(200);

    expect(res.body.data[0].id).toEqual(orderTwo.data.id);
    expect(res.body.data[1].id).toEqual(orderThree.data.id);

    expect(res.body.data[0].ticket.id).toEqual(ticketTwo.id);
    expect(res.body.data[1].ticket.id).toEqual(ticketThree.id);
})