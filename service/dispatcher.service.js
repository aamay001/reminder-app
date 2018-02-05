'use strict';

const config = require('../app/config');
const twilio = require('./twilio.service');
const {User} = require('../models/user');
const {Reminders} = require('../models/reminder');
const endOfToday = require('date-fns/end_of_today');
const isPast = require('date-fns/is_past');
const distanceInWordsStrict = require('date-fns/distance_in_words_strict');
const fnsParse = require('date-fns/parse')

const POLLING_INTERVAL = 30000;
let REMINDER_DATE_THRESHOLD = endOfToday();
let STOP_REQUESTED = false;
let TIMER;

function start(){
  twilio.init();
  resetInterval();
  console.log('Dispatcher started.');
}

function resetInterval(){
  TIMER = setTimeout(getAndCheck, POLLING_INTERVAL);
}

function stop(){
  if(TIMER){
    clearTimeout(TIMER);
    STOP_REQUESTED = true;
    console.log('Dispatcher stop requested.');
  }
  else{
    console.log('Dispatcher is not running.');
  }
}

function getAndCheck(){
  if(TIMER){
    clearTimeout(TIMER);
  }
  console.log('Dispatcher running.');
  REMINDER_DATE_THRESHOLD = endOfToday();
  getUndispatchedReminders()
    .then( reminders => {
      checkForDispatchable(reminders)
        .then(() => {
          if(!STOP_REQUESTED){
            resetInterval();
          }
        })
        .catch(err => {
          console.log(err);
        })
    })
}

function getUndispatchedReminders(){
  return Reminders
    .find({complete:false , date: { $lte : REMINDER_DATE_THRESHOLD }})
    .sort({date: 'asc'});
}

function checkForDispatchable(reminders){
  return new Promise( (resolve, reject) => {
    for( let i=0; i < reminders.length; i++){
      let thisReminder = reminders[i];
      if (isPast(fnsParse(thisReminder.date), new Date() )) {
        dispatch(thisReminder)
          .then(dispatchedReminder => {
            console.log({message:'Dispatched from Past', reminder:dispatchedReminder.apiGet()});
          });
      }
      else {
        let timeToDispatch = distanceInWordsStrict(new Date(), fnsParse(thisReminder.date), {unit:'m'}).replace('minutes', '');
        if (parseInt(timeToDispatch) <= 0){
          dispatch(thisReminder)
            .then(dispatchedReminder => {
              console.log({message:'Dispatched from 1 min', reminder:dispatchedReminder});
            });
        }
      }
    }
    resolve();
  });
}

function dispatch(reminder){
  return User.findOne({_id: reminder.user_id})
    .then(user => {
        reminder.complete = true,
        reminder.sentDate = new Date().toISOString();
        reminder.sentConfirmation = config.DEVELOPMENT;
        return Reminders.findByIdAndUpdate(reminder._id, reminder)
          .then(updatedReminder => {
            return updatedReminder;
          });
    })
    .catch(err => {
      console.log(err);
    })
}

module.exports = { start, stop };