import mongoose from "mongoose";
import { app } from "../../app";
import request from "supertest";
import { Order } from "../../models/order";
import { OrderStatus } from "@rpticketsproject/common";
import jwt from "jsonwebtoken"
import {stripe} from '../../stripe';
import { Payment } from "../../models/payment";

jest.mock('../../stripe.ts');

it('returns 404 if order not found', async () => {
    await request(app).post('/api/payments')
    .set('Cookie', global.signin())
    .send({ orderId: new mongoose.Types.ObjectId().toHexString(), token: 'test-token' })
    .expect(404);
});

it('returns 401 if order not belong to a user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: 40
    })

    await order.save();

    await request(app).post('/api/payments')
    .set('Cookie', global.signin())
    .send({ orderId: order.id, token: 'test-token' })
    .expect(401);
})

it('returns 400 if order is cancelled', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const payload = {
        id: userId,
        email: 'test@test.com'
    }
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = {jwt: token};
    const sessionJSON = JSON.stringify(session);
    const base64Str = Buffer.from(sessionJSON).toString('base64');
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        status: OrderStatus.Cancelled,
        version: 0,
        price: 40
    })

    await order.save();

    await request(app).post('/api/payments')
    .set('Cookie', `session=${base64Str}`)
    .send({ orderId: order.id, token: 'test-token' })
    .expect(400);
})

// it('returns a 201 with valid inputs', async () => {
//     const userId = new mongoose.Types.ObjectId().toHexString();
//     const orderId = new mongoose.Types.ObjectId().toHexString();
//     const order = Order.build({
//         id: orderId,
//         userId: userId,
//         status: OrderStatus.Created,
//         version: 0,
//         price: 40
//     });
//     const data = await order.save();
//     console.log('id', order, data)
//     await request(app).post('/api/payments')
//     .set('Cookie', global.signin(userId))
//     .send({ orderId: orderId, token: 'tok_visa' })
//     .expect(201);

//     const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//     expect(chargeOptions.source).toEqual('tok_visa');
//     expect(chargeOptions.amount).toEqual(order.price * 100);
//     expect(chargeOptions.currency).toEqual('usd');
// })