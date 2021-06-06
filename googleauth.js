const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//user model 
//const User = require('../spsf_service/models/googleStore');
//const findOrCreate = require("mongoose-findorcreate");

passport.use(new GoogleStrategy({
    clientID: '453724700226-0h2fj3ijlmkkbc3inl37mdpi7vbc2qdn.apps.googleusercontent.com',
    clientSecret: 'swrlV8tlVbyLzZj1F_619E8k',
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(function(user, done) {
    done(null, user);
});