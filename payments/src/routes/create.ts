import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  currentUser,
  NotAuthorizedError,
} from "@sjtickets/common";
import { Order, OrderStatus } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { nats } from "../nats-client";

const router = express.Router();

router.post(
  "/api/payments/",
  currentUser,
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("token is required"),
    body("orderId").not().isEmpty().withMessage("orderId is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    const charge = await stripe.charges.create({
      currency: "gbp",
      amount: order.price * 100,
      source: token,
    });

    const payment = await new Payment({
      orderId,
      stripeId: charge.id,
    }).save();

    await new PaymentCreatedPublisher(nats.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
