import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";
import { ExpirationCompleteEvent, OrderStatus } from "@rpticketsproject/common";

const setup = async () => {
  // create a listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 30,
  });
  await ticket.save();
  // create and save a order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: "asedfaeda",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, msg };
};

it("updates the order status to cancelled", async () => {
    const { listener, ticket, order, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an OrderCancelled event", async () => {
    const { listener, ticket, order, data, msg } = await setup();
    jest.clearAllMocks();
    await listener.onMessage(data, msg);
    expect((natsWrapper.client.publish as jest.Mock)).toHaveBeenCalled();
    const [subject, payload] = (natsWrapper.client.publish as jest.Mock).mock.calls[0];
    const eventData = JSON.parse(payload);
    expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
    const { listener, ticket, order, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});
