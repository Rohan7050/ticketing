import { NotFoundError, NotAuthorizedError, requireAuth, OrderStatus } from '@rpticketsproject/common';
import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const {orderId} = req.params;
    if(!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new NotFoundError();
    };
    const order = await Order.findById(orderId).populate('ticket');
    if(!order) {
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id,
        }
    })
    return res.status(204).send({ message: "success", data: order});
})

export {router as deleteOrderRouter}