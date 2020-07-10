import express, { Request, Response } from "express";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  currentUser,
  NotAuthorizedError,
  BadRequestError,
} from "@sjtickets/common";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
import { nats } from "../nats-client";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = express.Router();

router.put(
  "/api/tickets/:ticketId",
  currentUser,
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    const { id: userId } = req.currentUser!;
    if (ticket.userId !== userId) {
      throw new NotAuthorizedError();
    }

    const { title, price, description } = req.body;
    await ticket
      .set({
        title,
        description,
        price,
      })
      .save();

    await new TicketUpdatedPublisher(nats.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    return res.send(ticket);
  }
);

export { router as editTicketRouter };
