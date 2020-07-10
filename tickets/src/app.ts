import express from "express";
require("express-async-errors");
import { json } from "body-parser";
import { NotFoundError, errorHandler, currentUser } from "@sjtickets/common";
import cookieSession from "cookie-session";

import { showTicketRouter } from "./routes/show";
import { editTicketRouter } from "./routes/edit";
import { indexTicketRouter } from "./routes/index";
import { createTicketRouter } from "./routes/create";

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

app.use(showTicketRouter);
app.use(editTicketRouter);
app.use(indexTicketRouter);
app.use(createTicketRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
