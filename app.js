import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import session from "express-session";
import sessionFileStore from "session-file-store";

import { SESSION_SECRET, CLIENT_SCOPES } from "./constants.js";
import { auth } from "./auth.js";

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");

auth(passport);

const sessionMiddleware = session({
  resave: true,
  saveUninitialized: true,
  store: new sessionFileStore(session)({}),
  secret: SESSION_SECRET,
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res, next) {
  if (!req.user || !req.isAuthenticated()) {
    res.redirect("/auth/google");
  } else {
    res.render("index", { title: "Photoframe" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy();
    res.redirect("/");
  });
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: CLIENT_SCOPES,
    failureFlash: true,
    session: true,
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    failureFlash: true,
    session: true,
  }),
  (req, res) => {
    console.log("User has logged in.");
    req.session.save(() => {
      res.redirect("/");
    });
  }
);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.locals.status = res.locals.error.status ?? 500;

  res.status(res.locals.status);
  res.render("error");
});

export default app;
