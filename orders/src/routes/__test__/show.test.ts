import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("returns an error if user does not own the order", async () => {
  const ticket = await new Ticket({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "test-title",
    price: 20,
  }).save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.login())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.login())
    .send({})
    .expect(401);
});

it("fetches the order", async () => {
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

  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send({})
    .expect(200);

  expect(response.body.id).toEqual(order.id);
});
