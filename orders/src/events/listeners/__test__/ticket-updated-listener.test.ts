import mongoose from "mongoose";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { nats } from "../../../nats-client";
import { TicketUpdatedEvent } from "@sjtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(nats.client);

  // create and save a ticket
  const ticket = await new Ticket({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  }).save();

  // create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 999,
    userId: mongoose.Types.ObjectId().toHexString(),
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

it("finds, updates and saves a ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks a message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has an incorrect version", async () => {
  const { listener, data, msg } = await setup();

  // set the wrong version
  data.version += 10;

  // call the onMessage function with the data object + message object
  try {
    await listener.onMessage(data, msg);
  } catch (e) {}

  // write assertions to make sure ack function is NOT called
  expect(msg.ack).not.toHaveBeenCalled();
});
