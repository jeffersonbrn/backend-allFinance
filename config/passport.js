/* eslint-disable keyword-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-spacing */
/* eslint-disable semi */
/* eslint-disable spaced-comment */
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
//const User = require('../models/user');
const config = require('./keys');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = function(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;

  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    const finduser = prisma.users.findUnique({
      where: {
        id: jwtPayload._doc._id,
      }
    }).then((finduser) => {
      if(err) {
        return done(err, false);
      }
      if(finduser) {
        return done(null, finduser);
      } else {
        return done(null, false)
      }
    });
  }));
};
