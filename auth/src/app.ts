import express from "express";
require("express-async-errors");
import { json } from "body-parser";
import { NotFoundError, errorHandler } from "@sjtickets/common";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current";
import { loginUserRouter } from "./routes/login";
import { logoutUserRouter } from "./routes/logout";
import { registerUserRouter } from "./routes/register";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(loginUserRouter);
app.use(logoutUserRouter);
app.use(registerUserRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
