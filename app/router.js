import passport from "passport";
import expressPromiseRouter from "express-promise-router";

import { fetchImages } from "./images.js";

const { APP_NAME, CLIENT_SCOPES, INTERVAL } = process.env;

const router = expressPromiseRouter();

router.get("/", async (req, res) => {
  if (!req.user || !req.isAuthenticated()) {
    res.redirect("/auth/google");
  } else {
    const authToken = req.user.token;
    const images = await fetchImages(authToken);
    const interval = INTERVAL * 1000;

    res.render("index", {
      title: APP_NAME,
      initialData: JSON.stringify({
        images,
        interval,
      }),
    });
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
    scope: CLIENT_SCOPES.split(","),
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
