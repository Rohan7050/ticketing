import {
  Subjects,
  Listener,
  OrderCreatedEvent,
  OrderStatus,
} from "@rpticketsproject/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import {Order} from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
    const order = Order.build({
        id: data.id,
        price: data.ticket.price,
        status: data.status,
        version: data.version,
        userId: data.userId
    })
    await order.save();
    msg.ack();
  }
}
