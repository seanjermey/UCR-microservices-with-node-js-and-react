import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@sjtickets/common";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { Password } from "../utils/password";

const router = express.Router();

router.post(
  "/api/users/register",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    // create user
    console.log("Creating a user....");
    const user = await new User({
      email,
      password: await Password.toHash(password),
    }).save();

    // generate JWT
    req.session!.jwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    res.status(201).send(user);
  }
);

export { router as registerUserRouter };
