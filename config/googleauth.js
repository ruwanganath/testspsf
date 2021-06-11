const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy; //google passport strategy 
//user model 
//const User = require('../models/googleStore');
//const findOrCreate = require("mongoose-findorcreate");

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_GOOGLE,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile); //request profile 
  }
));

passport.serializeUser((user, done) => { //serialize user 
    done(null, user);
})

//deserialize user 
passport.deserializeUser(function(user, done) {
    done(null, user);
});
