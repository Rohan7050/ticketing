import request from "supertest";
import { app } from "../../app";

jest.mock('../../nats-wrapper.ts');

const createTicketEntry = (title: string, price: number) => {
    return request(app)
    .post('/api/tickets')
    .set("Cookie", global.signin())
    .send({
        title,
        price
    });
}

it("return list of all the tickets from db", async () => {
    await createTicketEntry('one', 10);
    await createTicketEntry('two', 10);
    await createTicketEntry('three', 10);

    const res = await request(app)
    .get("/api/tickets")
    .set('Cookie', global.signin())
    .send()
    expect(res.body.data.length).toEqual(3);
})