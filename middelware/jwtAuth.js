const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const bcrypt = require('bcrypt');
const UserShema = require('../models/User');


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    UserShema.findOne({ "email": username }, (err, user) => {
        if (!user) {
            return done(null, false, { message: "Bilgilerinizi konytol edip tekrar deneyin" });
        }
        bcrypt.compare(password, user.password, (error, res) => {
            if (error || !res) {
                return done(null, false, { message: "Bilgilerinizi konytol edip tekrar deneyin" });
            }
            return done(err, user);
        });

    });
}));

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SESSION_SECRET_KEY
};

passport.use(new JwtStrategy(options, (jwt_payload, done) => {
    return done(null, jwt_payload);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;