// passport.js

const User = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SK,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload._id).select("-password");
      return user ? done(null, user) : done(null, false);
    } catch (error) {
      console.error("Passport error:", error);
      return done(error, false);
    }
  })
);

module.exports = isAuth = () => passport.authenticate("jwt", { session: false });
