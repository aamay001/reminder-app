'user strict';

const {Reminders} = require('../models/reminder');
const {User} = require('../models/user');

const createReminder = (req, res) => {
  Reminders.validateRequiredFields(req.body)
    .then( (validation) => {
      return Reminders.validateFieldTypes(req.body)
        .then( (typeValidation) => {
          return User.findById(req.body.user_id)
            .then(user => {
              return Reminders.create(req.body)
                .then( reminder => {
                  res.status(201).send(reminder);
                });
            });
        });
    })
    .catch(err => {
      res.status(400).send(err);
    })
}

const getReminders = (req, res) => {
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