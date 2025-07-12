import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

jest.mock('../../nats-wrapper.ts')

it("has a route handler listening to /api/tickets for post requests", async () => {
    const res = await request(app).post('/api/tickets').send({})
    expect(res.status).not.toEqual(404);
})

it("can only be accessed by sign in user", async () => {
    const res = await request(app).post('/api/tickets').send({})
    expect(res.status).toEqual(401);
})

it("return a status other than 401 if user is signed in", async () => {
    const res = await request(app).post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})
    expect(res.status).not.toEqual(401);
})

it("return an error if invalid title is provided", async () => {
    const res = await request(app).post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: '',
        price: 10
    })
    expect(res.status).toEqual(400);
})

it("return an error if invalid price is provided", async () => {
    const res = await request(app).post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: '',
        price: -10
    })
    expect(res.status).toEqual(400);
})

it("return an success and create an entry in DB if valid price and title is provided", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    const res = await request(app).post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'testing one',
        price: 10
    })
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(res.status).toEqual(201);
})

it('publishes an event', async () => {
    const title = 'new item';
    await request(app).post('/api/tickets').set('Cookie', global.signin())
    .send({
        title,
        price: 50
    })
    .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})