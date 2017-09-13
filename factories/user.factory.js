'use strict';

const fakes = require('faker');
const {User} = require('../models/user');

function createOne(){
  return{
    username: fakes.internet.user(),
    firsName: fakes.name.firstName(),
    lastName: fakes.name.lastName(),
    password: User.securePassword(fakes.internet.password()),
    phoneNumber: fakes.phone.phoneNumber(),
    email: fakes.internet.email(),
    confirmed: true
  };
}

function createMany(count){
  let users = [];
  for( let i = 0; i < count; i++){
    users.push(createOne());
  }
  return users;
}

module.exports = {
  createOne,
  createMany
};