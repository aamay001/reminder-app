'use strict';

const fakes = require('faker');
const {User} = require('../models/user');

function createOne(securePassword=true){
  let pw = fakes.internet.password(10,false);
  pw = (securePassword ? User.securePassword(pw, true) : pw);
  return {
    username: fakes.internet.userName(),
    firstName: fakes.name.firstName(),
    lastName: fakes.name.lastName(),
    password: pw,
    phoneNumber: fakes.random.number(9999999).toString(),
    email: fakes.internet.email(),
    confirmed: true
  };
}

function createMany(count, securePassword=true){
  let users = [];
  for(let i = 0; i < count; i++){
    users.push(createOne(securePassword));
  }
  return users;
}

module.exports = {
  createOne,
  createMany
};