import { Message } from "node-nats-streaming";
import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@rpticketsproject/common";
import { queuGroupName } from "./queue-group-name";
import { Ticket, TicketDoc } from "../../models/ticket";
import { MyTicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queuGroupName;
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    // find the ticket that the order is reserving
    const ticket: TicketDoc | null = await Ticket.findById(data.ticket.id);
    // if no ticket throw error
    if (!ticket) throw new Error("Ticket Not Found");
    // ark ticket being reserved by setting orderId property
    ticket.set({
      orderId: data.id,
    });
    // save ticket
    await ticket.save();
    await new MyTicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
    // ack the message
    msg.ack();
  }
}
