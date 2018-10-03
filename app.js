'use strict';
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'dev' ||
  process.env.NODE_ENV === 'test') {
  require('dotenv').config();
}
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

///////////////////
// Routes
///////////////////
app.use('/api/auth/', auth.router);
app.use('/api/reminder/', remindersRouter );
app.use('/api/user', userRouter);
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
