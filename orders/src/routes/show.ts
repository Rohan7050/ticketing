import { NotAuthorizedError, NotFoundError, requireAuth } from '@rpticketsproject/common';
import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {

    const {orderId} = req.params;
    if(!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new NotFoundError();
    };
    const order = await Order.findById(orderId);
    if(!order) {
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    return res.status(200).send({ message: "success", data: order });
})

export {router as showOrderRouter}