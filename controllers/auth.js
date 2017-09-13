'use strict';

const jwt = require('jsonwebtoken');
const config = require('../app/config');

const createAuthToken = user => {
  return jwt.sign({user}, config.TOKEN_SECRET, {
    subject: user.username,
    expiresIn: config.TOKEN_EXP
  })
}

module.exports = {
  createAuthToken
};