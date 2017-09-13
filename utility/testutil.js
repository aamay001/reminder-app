'use strict';

const userFactory = require('../factories/user.factory');
const mongoose = require('mongoose');
const {User} = require('../models/user');

function seedDatabaseWithUser(){
  console.info('Seeding database with users.');
  return new Promise( (resolve, reject) =>{
    let user = userFactory.createOne(false);
    let password = user.password;
    user.password = User.securePassword(user.password, true);
    User.create(user)
      .then(user => {
        user.password = password;
        resolve(user);
      })
      .catch(err => {
        console.error(err)
        reject(err);
      });
  });

}

function dropDatabase(){
  console.warn('Dropping database.');
  return mongoose.connection.dropDatabase();
}

module.exports = {
  seedDatabaseWithUser,
  dropDatabase,
  userFactory
}