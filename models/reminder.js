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
    type: Date,
    required: true
  },
  complete: {
    type: Boolean,
    default: false
  },
  sentDate: {
    type: Date
  },
  sentConfirmation: {
    type: String
  },
  user_id: {
    type: String,
    required: true
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