const { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } = require("./constants");
const { Strategy: GoogleOAuthStrategy } = require("passport-google-oauth20");

module.exports.auth = (passport) => {
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
};
