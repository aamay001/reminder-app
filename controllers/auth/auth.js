//////////////////////
// AUTH CONTROLLER
//////////////////////
'use strict';

const config = require('../../app/config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {basicStrategy, tokenStrategy} = require('./strategies');
const NO_SESSION = {session:false};
const JWT_ALGORITHM = 'HS256';

const createAuthToken = user => {
  return jwt.sign({user}, config.TOKEN_SECRET, {
    subject: user.username,
    expiresIn: config.TOKEN_EXP,
    algorithm: JWT_ALGORITHM
  });
}

function init(app) {
  app.use(passport.initialize());
  passport.use(basicStrategy);
  passport.use(tokenStrategy);
}

const verifyAuthToken = token => {
  return jwt.verify(token, config.TOKEN_SECRET, {algorithm: [JWT_ALGORITHM]} )
}

const basic = passport.authenticate('basic', NO_SESSION );
const jsonWebToken = passport.authenticate('jwt', NO_SESSION );

module.exports = {
  createToken: createAuthToken,
  verifyToken: verifyAuthToken,
  basic: basic,
  jwt: jsonWebToken,
  init
};