import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { nats } from "../../nats-client";

it("returns a 404 it order does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .delete(`/api/orders/${id}`)
    .set("Cookie", global.login())
    .send({})
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const user = global.login();
  const ticket = await new Ticket({
    title: "test-title",
    price: 20,
  }).save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app).delete(`/api/orders/${order.id}`).send().expect(401);
});

it("marks an order as cancelled", async () => {
  const user = global.login();
  const ticket = await new Ticket({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "test-title",
    price: 20,
  }).save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
  const user = global.login();
  const ticket = await new Ticket({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "test-ticket",
    price: 20,
  }).save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  jest.clearAllMocks();

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(nats.client.publish).toHaveBeenCalled();
});
