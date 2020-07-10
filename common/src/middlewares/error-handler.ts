import { Request, Response, NextFunction } from "express";
import { AbstractCustomError } from "../errors/abstract-custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AbstractCustomError) {
    return res.status(err.statusCode).send({ errors: err.serialize() });
  }

  console.error(err);
  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
