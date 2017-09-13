'use strict';

const config = require('../../app/config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {basicStrategy, tokenStrategy} = require('./strategies');
const NO_SESSION = {session:false};

const createAuthToken = user => {
  return jwt.sign({user}, config.TOKEN_SECRET, {
    subject: user.username,
    expiresIn: config.TOKEN_EXP
  });
}

function basic(req, res, next) {
  passport.authenticate('basic', NO_SESSION )(req,res,next);
}

function jsonWebToken(req, res, next) {
  passport.authenticate('jwt', NO_SESSION )(req,res,next);
}

function init(app) {
  app.use(passport.initialize());
  passport.use(basicStrategy);
  passport.use(tokenStrategy);
}

module.exports = {
  createAuthToken: createAuthToken,
  basic: basic,
  jwt: jsonWebToken,
  init
};