const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const UserSchema = require("../Model/Auth");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        let user = await UserSchema.findOne({ email });
        if (!user) {
          done(null, false, { message: "user not exist" });
        }
        // match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            done(null, false, { message: "password is not matched" });
          } else {
            return done(null, user);
          }
        });
      }
    )
  );
  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    UserSchema.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
