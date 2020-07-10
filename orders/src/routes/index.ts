import express, { Request, Response } from "express";
import { requireAuth, currentUser } from "@sjtickets/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate("ticket");

    return res.send(orders);
  }
);

export { router as indexOrderRouter };
