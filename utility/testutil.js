'use strict';

const userFactory = require('../factories/user.factory');
const mongoose = require('mongoose');
const {User} = require('../models/user');

function seedDatabaseWithUsers(){
  console.info('Seeding database with users.');
  return User.insertMany(userFactory.createMany(5)).catch(err => console.error(err));
}

function dropDatabase(){
  console.warn('Dropping database.');
  return mongoose.connection.dropDatabase();
}

module.exports = {
  seedDatabaseWithUsers,
  dropDatabase
}