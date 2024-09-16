const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Admin = require("../models/adminModel.js");
require("dotenv").config();

passport.serializeUser((admin, done) => {
  done(null, admin.id);
});

passport.deserializeUser((id, done) => {
  Admin.findById(id)
    .then((admin) => {
      done(null, admin);
    })
    .catch((err) => {
      done(err, null);
    });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "http://localhost:9000/api/v1/admins/google/redirect",
      clientID: process.env.clientId,
      clientSecret: process.env.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      // Passport callback function
      Admin.findOne({ googleId: profile.id })
        .then((currentUser) => {
          if (currentUser) {
            done(null, currentUser);
          } else {
            new Admin({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
            })
              .save()
              .then((newUser) => {
                done(null, newUser);
              });
          }
        })
        .catch((err) => {
          done(err, null);
        });
    }
  )
);
