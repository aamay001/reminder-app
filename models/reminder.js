'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const ReminderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  date: {
    type: date,
    required: true
  },
  complete: {
    type: boolean,
    default: false
  },
  sentDate: {
    type: date
  },
  sentConfirmation: {
    type: String
  }
});

ReminderSchema.methods.apiGet = function(){
  return {
    name: this.name,
    text: this.text,
    date: this.date,
    complete: this.complete
  };
}

const Reminders = mongoose.model('Reminders', ReminderSchema);

module.exports = {Reminders};