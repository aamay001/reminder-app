'use strict';

const twilio = require('twilio');
const {TWILIO_ACCOUNT, TWILIO_TOKEN, TWILIO_NUMBER} = require('../app/config');
const config = require('../app/config');
let client;

function init(){
  if(!client){
    client = new twilio(TWILIO_ACCOUNT, TWILIO_TOKEN);
  }
}

function sendSMS(body, to){
  if (config.PRODUCTION){
    return client.messages.create({
      body: body,
      to: to,  // Text this number
      from: TWILIO_NUMBER // From a valid Twilio number
    });
  }

  return Promise.resolve({
    sid: 'testok'
  });
}

module.exports = {
  init,
  sendSMS
};