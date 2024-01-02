import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { initializeAuth } from "./auth.js";
import { initializeRouter } from "./routes.js";

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");

initializeAuth(app);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

initializeRouter(app);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.locals.status = res.locals.error.status ?? 500;

  res.status(res.locals.status);
  res.render("error");
});

export default app;
