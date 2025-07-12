import express from "express";
import "express-async-errors";
import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@rpticketsproject/common";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexRouter } from "./routes/index";
import {updateRouter} from "./routes/update";

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

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexRouter);
app.use(updateRouter);

app.use("/testing", (req, res) => {
  res.send("working");
});

app.get("*", () => {
  console.log("reached here");
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
