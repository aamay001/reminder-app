//////////////////////
// REMINDER ROUTER
//////////////////////
'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Reminders} = require('../models/reminder');
const {User} = require('../models/user');
const auth = require('../controllers/auth/auth');

router.get('/', auth.jwt, (req, res) => {
  getUserId(req)
  .then(userId => {
    return Reminders.find({user_id: userId});
  })
  .then(reminders => {
    return res.status(200).json(reminders);
  })
  .catch(err => {
    console.error(err);
    return res.status(404).json(err);
  });
});

function getUserId(req){
  return new Promise((resolve, reject) => {
    User.findOne({username: req.user.username}, {_id: 1})
      .then(user =>{
        if (user)
          resolve(user._id.toString());
        else
          reject('Bad request.');
      });
  })
}

module.exports = router;