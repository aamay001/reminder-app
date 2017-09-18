'use strict';

const userFactory = require('../factories/user.factory');
const reminderFactory = require('../factories/reminder.factory');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {User} = require('../models/user');
const {Reminders} = require('../models/reminder');

function seedDatabaseWithUser(){
  console.info('Seeding database with user.');
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
        console.error(err.toString().red)
        reject(err);
      });
  });
}

function seedDatabaseWithReminders(user){
  console.info('Seeding database with reminders.');
  return new Promise((resolve, reject) =>{
    let reminders = reminderFactory.createMany(5, user);
    resolve(Reminders.insertMany(reminders));
  });
}

function dropDatabase(){
  console.warn('Dropping database.');
  return mongoose.connection.dropDatabase();
}

module.exports = {
  seedDatabaseWithUser,
  seedDatabaseWithReminders,
  dropDatabase,
  reminderFactory,
  userFactory
}