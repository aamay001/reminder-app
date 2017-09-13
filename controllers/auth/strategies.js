//////////////////////
// AUTH STRATEGIES
//////////////////////
'use strict';

const passport = require('passport');
const {BasicStrategy} = require('passport-http');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const {User} = require('../../models/user');
const {TOKEN_SECRET} = require('../../app/config');

const INVALID_LOGIN = {
  ok: false,
  reason: "Login Error",
  message: "Incorrect username or password."
};

// Basic Authentication Strategy
// Used to
const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user;
  User.findOne({username: username})
    .then(_user => {
      console.log(_user);
      user = _user;
      if (!user){
        return Promise.reject(INVALID_LOGIN);
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if(!isValid){
        return Promise.reject(INVALID_LOGIN);
      }
      return callback(null, user);
    })
    .catch(err => {
      if(err.reason === INVALID_LOGIN.reason) {
        return callback(null,false, err);
      }
      return callback(err,false);
    })
});

const tokenStrategy = new JwtStrategy({
    secretOrKey: TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = {basicStrategy, tokenStrategy};