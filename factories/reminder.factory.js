'use strict';

const fakes = require('faker');
const {Reminder} = require('../models/reminder');

function createOne(user){
  return {
    name: fakes.random.words(3),
    text: fakes.lorem.sentences(1),
    date: fakes.date.future(),
    complete: false,
    sentDate: null,
    sentConfirmation: null,
    user_id: user
  };
}

function createMany(count, user){
  let reminders = [];
  for(let i = 0; i < count; i++){
    reminders.push(createOne(user));
  }
  return reminders;
}

module.exports = {
  createOne,
  createMany
};