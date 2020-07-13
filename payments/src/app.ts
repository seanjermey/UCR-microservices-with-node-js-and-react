import express from "express";
require("express-async-errors");
import { json } from "body-parser";
import { NotFoundError, errorHandler, currentUser } from "@sjtickets/common";
import cookieSession from "cookie-session";
import { createChargeRouter } from "./routes/create";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== "test",
    secure: false,
  })
);
// app.use(currentUser);
app.use(createChargeRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
