'use strict';

const {User} = require('../models/user');
const twilio = require('../service/twilio.service');
twilio.init();

const createUser = (req, res) => {
  User.validateRequiredFields(req.body)
    .then( validation => {
      return User.validateFieldTypes(req.body)
        .then( typeValidation => {
          return User.find({username: req.body.username})
            .then(user => {
              if (!user){
                return Promise.reject('Username conflict. Username is already taken.');
              }
              else {
                return User.create(req.body)
                  .then(user => {
                    const text = `Here is your TellMeonDate account confirmation code: ${user.confirmationCode}`;
                    twilio.sendSMS(text, user.phoneNumber)
                    .then( message => {
                      res.status(201).send(user.apiGet());
                    });
                  });
              }
            });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(409).send(err);
    });
}

module.exports = {createUser};


