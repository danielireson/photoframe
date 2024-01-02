const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const sessionFileStore = require("session-file-store");

const { SESSION_SECRET, CLIENT_SCOPES } = require("./constants");
const { auth } = require("./auth");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
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
app.use(express.static(path.join(__dirname, "public")));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res, next) {
  if (!req.user || !req.isAuthenticated()) {
    res.redirect("/auth/google");
  } else {
    res.render("index", { title: "Express" });
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.locals.status = res.locals.error.status ?? 500;

  // render the error page
  res.status(res.locals.status);
  res.render("error");
});

module.exports = app;
