import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { nats } from "../../../nats-client";
import { OrderCancelledEvent } from "@sjtickets/common";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../../models/order";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(nats.client);

  const order = await new Order({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 20,
    userId: mongoose.Types.ObjectId().toHexString(),
  }).save();

  // create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    order,
    data,
    msg,
  };
};

it("sets the order status to cancelled", async () => {
  const { listener, order, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder).toBeDefined();
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(updatedOrder!.version).toEqual(data.version);
});

it("acks a message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
