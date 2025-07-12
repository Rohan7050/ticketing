import request from 'supertest'
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from '@rpticketsproject/common';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

jest.mock('../../nats-wrapper.ts');

it('should cancel the order', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 59
    });
    await ticket.save();
    const user = global.signin();
    const {body: order} = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);
    await request(app)
        .delete(`/api/orders/${order.data.id}`)
        .set("Cookie", user)
        .expect(204);
    
    const updatedOrder = await Order.findById(order.data.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emits order cancelled event.', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 59
    });
    await ticket.save();
    const user = global.signin();
    const {body: order} = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);
    await request(app)
        .delete(`/api/orders/${order.data.id}`)
        .set("Cookie", user)
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})