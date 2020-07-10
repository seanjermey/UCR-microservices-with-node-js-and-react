import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const createTicket = async () => {
  return new Ticket({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "test-ticket",
    price: 20,
  }).save();
};

it("can fetch a list of tickets", async () => {
  const userOne = global.login();
  const userTwo = global.login();

  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();
  const ticketThree = await createTicket();

  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticketTwo.id,
    })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticketThree.id,
    })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .send({})
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
