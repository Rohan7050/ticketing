import {
  Listener,
  Subjects,
  OrderCancelledEvent,
} from "@rpticketsproject/common";
import { Message } from "node-nats-streaming";
import { queuGroupName } from "./queue-group-name";
import { Ticket, TicketDoc } from "../../models/ticket";
import { MyTicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queuGroupName;

  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    // find the ticket that the order is reserving
    const ticket: TicketDoc | null = await Ticket.findById(data.ticket.id);
    // if no ticket throw error
    if (!ticket) throw new Error("Ticket Not Found");
    // ark ticket being reserved by setting orderId property
    ticket.set({
      orderId: undefined,
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
