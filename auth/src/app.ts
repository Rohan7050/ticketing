import express from "express";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signupUserRouter } from "./routes/signup";
import { signinUserRouter } from "./routes/signin";
import { signoutUserRouter } from "./routes/signout";
import { errorHandler, NotFoundError } from "@rpticketsproject/common";
import cookieSession from "cookie-session";
import mongoose from "mongoose";

const app = express();

app.set("trust proxy", true);

app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
    keys: ["sssssasa"],
  })
);

app.use(currentUserRouter);
app.use(signupUserRouter);
app.use(signinUserRouter);
app.use(signoutUserRouter);
app.use('/testing', (req, res) => {
  res.send('working')
})

app.get("*", () => {
  console.log("reached here");
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
