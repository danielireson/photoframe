import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import session from "express-session";
import sessionFileStore from "session-file-store";
import expressPromiseRouter from "express-promise-router";
import { Strategy as GoogleOAuthStrategy } from "passport-google-oauth20";

import {
  APP_NAME,
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_SCOPES,
  CALLBACK_URL,
  SESSION_SECRET,
} from "./constants.js";

const app = express();
const router = expressPromiseRouter();

app.set("views", "views");
app.set("view engine", "ejs");

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
passport.use(
  new GoogleOAuthStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    (token, refreshToken, profile, done) => done(null, { profile, token })
  )
);
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    store: new sessionFileStore(session)({}),
    secret: SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(router);

router.get("/", (req, res) => {
  if (!req.user || !req.isAuthenticated()) {
    res.redirect("/auth/google");
  } else {
    res.render("index", { title: APP_NAME });
  }
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy();
    res.redirect("/");
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: CLIENT_SCOPES,
    failureFlash: true,
    session: true,
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    failureFlash: true,
    session: true,
  }),
  (req, res, next) => {
    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect("/");
    });
  }
);

router.use(async () => {
  throw new createError(404);
});

router.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.locals.status = res.locals.error.status ?? 500;

  res.status(res.locals.status);
  res.render("error");
});

export default app;
