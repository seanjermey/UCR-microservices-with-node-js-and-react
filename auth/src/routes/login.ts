import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@sjtickets/common";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { Password } from "../utils/password";

const router = express.Router();

router.post(
  "/api/users/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password not supplied"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid credentials.");
    }

    const passwordsMatch = await Password.compare(user.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials.");
    }

    // generate JWT
    req.session!.jwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    res.status(200).send(user);
  }
);

export { router as loginUserRouter };
