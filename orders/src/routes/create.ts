import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  BadRequestError,
  currentUser,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@sjtickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { nats } from "../nats-client";

const EXPIRATION_WINDOW_SECONDS = 30;

const router = express.Router();

router.post(
  "/api/orders",
  currentUser,
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.body.ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = await new Order({
      ticket,
      expiresAt,
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
    }).save();

    await new OrderCreatedPublisher(nats.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    return res.status(201).send(order);
  }
);

export { router as createOrderRouter };
