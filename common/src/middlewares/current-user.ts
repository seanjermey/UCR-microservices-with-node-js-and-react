import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CurrentUser {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUser;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session!.jwt) {
    next();
  }

  try {
    const currentUser = jwt.verify(
      req.session!.jwt,
      process.env.JWT_KEY!
    ) as CurrentUser;

    if (currentUser) {
      req.currentUser = currentUser;
    }
  } catch (e) {}

  next();
};
