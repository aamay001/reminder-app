'use strict';

require('dotenv').config();
const express = require('express');
var app = express();
const dispatcher = require('./service/dispatcher.service');

const config = require('./app/config');
const serverController = require('./controllers/server');
serverController.use(app);

const auth = require('./controllers/auth');
const remindersRouter = require('./routes/reminder');
const userRouter = require('./routes/user');

const {DEVELOPMENT} = config;
if (DEVELOPMENT) {
  const colors = require('colors');
  console.info('DEVELOPMENT'.yellow);
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(serverController.cors);
app.use(express.static('public'));
auth.init(app);

////////////////////////////////////////
// Manual DB population.
// let {User} = require('./models/user');
// let user = require('./factories/user.factory').createOne(false);
// console.info(user);
// user.password = User.securePassword(user.password,true);
// User.create(user)
// .then(newUser => {
//   let reminder = require('./factories/reminder.factory');
//   let r  = reminder.createMany(10, newUser._id.toString());
//   let {Reminders} = require('./models/reminder');
//   Reminders.insertMany(r);
// });

///////////////////
// Routes
///////////////////
app.use('/api/auth/', auth.router);
app.use('/api/reminder/', remindersRouter );
app.use('/user', userRouter);
///////////////////

app.use('*', (req, res) => {
  return res.status(404).json({message: 'Not Found'});
});

if (require.main === module) {
  serverController
    .start()
    .then(() => {
      dispatcher.start();
    })
    .catch(err => {
      console.error(err);
    });
}

module.exports = {
  app,
  startServer: serverController.start,
  stopServer: serverController.stop
};
