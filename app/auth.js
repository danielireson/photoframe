import passport from "passport";
import session from "express-session";
import sessionFileStore from "session-file-store";
import { Strategy as GoogleOAuthStrategy } from "passport-google-oauth20";

const { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, SESSION_SECRET } = process.env;

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

export const initializeAuth = (app) => {
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
};
