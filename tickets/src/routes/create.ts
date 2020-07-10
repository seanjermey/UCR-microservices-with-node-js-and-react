import express, { Request, Response } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "@sjtickets/common";
import { Ticket } from "../models/ticket";
import { nats } from "../nats-client";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

const router = express.Router();

router.post(
  "/api/tickets",
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
    const { title, price } = req.body;
    const { id: userId } = req.currentUser!;

    const ticket = await new Ticket({
      title,
      price,
      userId,
    }).save();

    await new TicketCreatedPublisher(nats.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    return res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
