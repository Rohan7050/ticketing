import express from "express";
import "express-async-errors";
import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@rpticketsproject/common";
import cookieSession from "cookie-session";
import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes/index";
import { showOrderRouter } from "./routes/show";
import { newOrderRouter } from "./routes/new";

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

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);

app.get("*", () => {
  console.log("reached here");
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
