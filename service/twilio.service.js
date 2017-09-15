'use strict';

const twilio = require('twilio');
const {TWILIO_ACCOUNT, TWILIO_TOKEN, TWILIO_NUMBER} = require('../app/config');
let client;

function init(){
  client = new twilio(TWILIO_ACCOUNT, TWILIO_TOKEN);
}

function sendSMS(body, to){
  return client.messages.create({
    body: body,
    to: to,  // Text this number
    from: TWILIO_NUMBER // From a valid Twilio number
  });
}

module.exports = {
  init,
  sendSMS
};