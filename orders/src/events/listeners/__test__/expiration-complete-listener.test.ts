import mongoose from "mongoose";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { nats } from "../../../nats-client";
import { ExpirationCompleteEvent, OrderStatus } from "@sjtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(nats.client);

  const ticket = await new Ticket({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  }).save();

  const order = await new Order({
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    ticket,
  }).save();

  // create a fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    ticket,
    order,
    data,
    msg,
  };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an OrderCancelled event", async () => {
  const { listener, ticket, order, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions
  expect(nats.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (nats.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(data.orderId);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
