import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { nats } from "../../../nats-client";
import { OrderCancelledEvent } from "@sjtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(nats.client);

  // create and save a ticket
  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = await new Ticket({
    title: "concert",
    price: 20,
    userId: mongoose.Types.ObjectId().toHexString(),
  })
    .set({ orderId })
    .save();

  // create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    ticket,
    data,
    msg,
  };
};

it("sets the orderId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.orderId).not.toBeDefined();
});

it("acks a message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions
  expect(nats.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (nats.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(ticketUpdatedData.orderId).not.toBeDefined();
});
