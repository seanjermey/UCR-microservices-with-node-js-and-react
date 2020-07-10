import express from "express";
import { currentUser } from "@sjtickets/common";

const router = express.Router();

router.get("/api/users/current", currentUser, (req, res) => {
  return res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
