import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket, TicketDoc } from "../../../models/ticket";
import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from "@rpticketsproject/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async (): Promise<{
  listener: OrderCreatedListener;
  ticket: TicketDoc;
  msg: Message;
  data: OrderCreatedEvent["data"];
}> => {
  // create an instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: "new Ticket",
    price: 20,
    userId: "121ed",
  });
  await ticket.save();

  //   create the fake data object
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "bnebndiaekd",
    expiresAt: "fsefde",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  //     @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('aks the message', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})

it('publishes a ticket updated event', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})