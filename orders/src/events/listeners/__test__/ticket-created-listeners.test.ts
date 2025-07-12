import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { TicketCreatedEvent } from "@rpticketsproject/common";
import { TicketCreatedListener } from "../ticket-created-listeners";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async (): Promise<{
  listener: TicketCreatedListener;
  data: TicketCreatedEvent["data"];
  msg: Message;
}> => {
  // create an instace of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "new Item",
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it("create and save a ticket", async () => {
  const { listener, data, msg } = await setup();

  //  call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  //  call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write a assertion to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
