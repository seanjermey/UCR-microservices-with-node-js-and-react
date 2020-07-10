import express from "express";
require("express-async-errors");
import { json } from "body-parser";
import { NotFoundError, errorHandler, currentUser } from "@sjtickets/common";
import cookieSession from "cookie-session";

import { createOrderRouter } from "./routes/create";
import { indexOrderRouter } from "./routes/index";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
// app.use(currentUser);

app.use(createOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
