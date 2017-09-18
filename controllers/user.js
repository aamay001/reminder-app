'use strict';

const {User} = require('../models/user');
const twilio = require('../service/twilio.service');
const config = require('../app/config');
const reCAPTCHA = require('recaptcha2');
twilio.init();

const recaptcha = new reCAPTCHA({
  siteKey: config.CAPTCHA_SITE_KEY,
  secretKey: config.CAPTCHA_SECRET
});

const createUser = (req, res) => {
  recaptcha.validateRequest(req)
    .then( captchaOk => {
      if(captchaOk){
        return User.validateRequiredFields(req.body)
        .then( validation => {
          return User.validateFieldTypes(req.body)
            .then( typeValidation => {
              req.body.username = req.body.username.toLowerCase();
              req.body.email = req.body.email.toLowerCase();
              return User.findOne( {$or: [{username: req.body.username},
                                      {email: req.body.email},
                                      {phoneNumber: req.body.phoneNumber}]})
                .then(user => {
                  if (user){
                    return Promise.reject('Username, phone number, or email address conflict. Username, phone number, or email address is already in use.');
                  }
                  else {
                    return User.securePassword(req.body.password)
                      .then(secPassword => {
                        req.body.password = secPassword;
                        return User.create(req.body)
                          .then(user => {
                            //const text = `Here is your TellMeonDate account confirmation code: ${user.confirmationCode}`;
                            //twilio.sendSMS(text, user.phoneNumber)
                            //.then( message => {
                              return res.status(201).send(user.apiGet());
                            //});
                          });
                      });
                  }
                });
            });
        })
        .catch(err => {
          console.error(err);
          return res.status(409).send(err);
        });
      }
      else {
        res.status(500).json({message:'Internal server error. Please try again.'});
      }
    })
    .catch(err => {
      res.status(400).json({message:'reCAPTCHA could not be verified. Please try again.'});
    });
}

module.exports = {createUser};