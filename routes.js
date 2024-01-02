import passport from "passport";
import expressPromiseRouter from "express-promise-router";

import { APP_NAME, CLIENT_SCOPES } from "./constants.js";

const router = expressPromiseRouter();

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

export const initializeRouter = (app) => app.use(router);
