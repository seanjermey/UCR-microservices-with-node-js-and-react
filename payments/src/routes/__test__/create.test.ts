import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@sjtickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.login())
    .send({
      token: "dsgjsdgkjsdgjjsdbgkkdsj",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  const order = await new Order({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 20,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.login())
    .send({
      token: "dsgjsdgkjsdgjjsdbgkkdsj",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = await new Order({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Cancelled,
    userId,
    price: 20,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.login(userId))
    .send({
      token: "dsgjsdgkjsdgjjsdbgkkdsj",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const price = Math.floor(Math.random() * 100000);
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = await new Order({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId,
    price,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.login(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  );

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("gbp");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
});
