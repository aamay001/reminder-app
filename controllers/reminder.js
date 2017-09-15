'user strict';

const {Reminders} = require('../models/reminder');
const {User} = require('../models/user');
const distanceInWordsStrict = require('date-fns/distance_in_words_strict')

const createReminder = (req, res) => {
  if (req.user.username !== req.body.user_id){
    return res.status(401).json({message:'Token identity mismatch.'});
  }

  Reminders.validateRequiredFields(req.body)
    .then( (validation) => {
      return Reminders.validateFieldTypes(req.body)
        .then( (typeValidation) => {
          let reminderDate = Date.parse(req.body.date);
          let timeToDispatch = distanceInWordsStrict(reminderDate, new Date(), {unit:'m'}).replace('minutes', '');
          if (parseInt(timeToDispatch) < 9){
            return Promise.reject("Reminder must be at least 10 minutes in the future.");
          }
          else {
            return User.findOne({username:req.body.user_id})
              .then(user => {
                req.body.user_id = user._id;
                return Reminders.create(req.body)
                  .then( reminder => {
                    res.status(201).send(reminder.apiGet());
                  });
              });
          }
        });
    })
    .catch(err => {
      console.error(err);
      res.status(400).send(err);
    })
}

const getReminders = (req, res) => {
  getUserId(req)
  .then(userId => {
    return Reminders.find({user_id: userId});
  })
  .then(reminders => {
    reminders = reminders.map(e=>e.apiGet());
    return res.status(200).json(reminders);
  })
  .catch(err => {
    console.error(err);
    return res.status(404).json(err);
  });
}

/////////////////////////////////////////////////
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

module.exports = {
  getReminders,
  createReminder
};