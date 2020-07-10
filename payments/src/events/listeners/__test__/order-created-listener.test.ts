import mongoose from "mongoose";
import { OrderCreatedListener } from "../order-created-listener";
import { nats } from "../../../nats-client";
import { OrderCreatedEvent, OrderStatus } from "@sjtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(nats.client);

  // create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: 20,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    msg,
  };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions
  const order = await Order.findById(data.id);

  expect(order).toBeDefined();
  expect(order!.price).toEqual(data.ticket.price);
  expect(order!.status).toEqual(data.status);
  expect(order!.version).toEqual(data.version);
});

it("acks a message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
