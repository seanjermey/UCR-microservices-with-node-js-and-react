import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

const INVALID_ID = new mongoose.Types.ObjectId().toHexString();
const VALID_TITLE = "title";
const VALID_PRICE = 20;

it("returns a 404 if the ticket is not found", async () => {
  await request(app).get(`/api/tickets/${INVALID_ID}`).send().expect(404);
});

it("returns the ticket if it is found", async () => {
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.login())
    .send({
      title: VALID_TITLE,
      price: VALID_PRICE,
    })
    .expect(201);

  response = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({});

  expect(response.status).toEqual(200);
  expect(response.body.title).toEqual(VALID_TITLE);
  expect(response.body.price).toEqual(VALID_PRICE);
});
