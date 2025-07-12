import mongoose from "mongoose";
import { TicketUpdatedListener } from "../ticket-updated-listeners";
import { TicketUpdatedEvent } from "@rpticketsproject/common";
import { Ticket, TicketDoc } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";

const setup = async (): Promise<{
  listener: TicketUpdatedListener;
  data: TicketUpdatedEvent["data"];
  msg: Message;
  ticket: TicketDoc;
}> => {
  // create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 30,
  });
  await ticket.save();

  // create a fate Data object

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 999,
    userId: "medmweda",
  };

  //  Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, ticket, msg };
};

it("find, update and saves a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  //  call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  //  call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write a assertion to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { listener, data, msg } = await setup();
  data.version = 10;
  //  call the onMessage function with the data object + message object
  try {
    await listener.onMessage(data, msg);
  } catch (e) {}

  // write a assertion to make sure ack function is called
  expect(msg.ack).not.toHaveBeenCalled();
});
