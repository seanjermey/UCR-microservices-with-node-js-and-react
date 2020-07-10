import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@sjtickets/common";
import { nats } from "../../../../tickets/src/nats-client";

it("has a route handler listening to /api/orders for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/orders").send({}).expect(401);
});

it("returns a status other than 401 is the user is signed in", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.login())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns a error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.login())
    .send({ ticketId })
    .expect(404);
});

it("returns a error if the ticket is already reserved", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const ticket = await new Ticket({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "test-ticket",
    price: 20,
  }).save();

  await new Order({
    userId,
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  }).save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.login())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = await new Ticket({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "test-ticket",
    price: 20,
  }).save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.login())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it("emits an order created event", async () => {
  const ticket = await new Ticket({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "test-ticket",
    price: 20,
  }).save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.login())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(nats.client.publish).toHaveBeenCalled();
});
