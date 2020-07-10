import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { nats } from "../../nats-client";
import { Ticket } from "../../models/ticket";

const INVALID_ID = new mongoose.Types.ObjectId().toHexString();
const ORIGINAL_TITLE = "ticket";
const NEW_TITLE = "updated ticket";
const ORIGINAL_PRICE = 20;
const NEW_PRICE = 30;

const createTicket = (cookie: string[]) => {
  return request(app).post("/api/tickets").set("Cookie", cookie).send({
    title: ORIGINAL_TITLE,
    price: ORIGINAL_PRICE,
  });
};

it("returns a 404 it ticket does not exist", async () => {
  await request(app)
    .put(`/api/tickets/${INVALID_ID}`)
    .set("Cookie", global.login())
    .send({
      title: NEW_TITLE,
      price: NEW_PRICE,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  await request(app)
    .put(`/api/tickets/${INVALID_ID}`)
    .send({
      title: NEW_TITLE,
      price: NEW_PRICE,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  let response = await createTicket(global.login());

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.login())
    .send({
      title: NEW_TITLE,
      price: NEW_PRICE,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.login();
  let response = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: NEW_PRICE,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: NEW_TITLE,
      price: -10,
    })
    .expect(400);
});

it("updates a ticket provided valid inputs", async () => {
  const cookie = global.login();
  let response = await createTicket(cookie);

  response = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: NEW_TITLE,
      price: NEW_PRICE,
    })
    .expect(200);

  expect(response.body.title).toEqual(NEW_TITLE);
  expect(response.body.price).toEqual(NEW_PRICE);
});

it("publishes an event", async () => {
  const cookie = global.login();
  let response = await createTicket(cookie);

  response = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: NEW_TITLE,
      price: NEW_PRICE,
    })
    .expect(200);

  expect(nats.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const cookie = global.login();
  let response = await createTicket(cookie);

  const ticket = await Ticket.findById(response.body.id);
  await ticket!
    .set({ orderId: mongoose.Types.ObjectId().toHexString() })
    .save();

  response = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: NEW_TITLE,
      price: NEW_PRICE,
    })
    .expect(400);

  expect(nats.client.publish).toHaveBeenCalled();
});
