'use strict';

require('dotenv').config();
const express = require('express');
var app = express();

const config = require('./app/config');
const serverController = require('./controllers/server');
serverController.use(app);

const {DEVELOPMENT} = config;
if (DEVELOPMENT) {
  const colors = require('colors');
  console.info('DEVELOPMENT'.yellow);
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(config.CORS);
app.use(express.static('public'));

///////////////////
// Routes go here
///////////////////

///////////////////

app.use('*', (req, res) => {
  return res.status(404).json({message: 'Not Found'});
});

if (require.main === module) {
  serverController.start().catch(err => {
    console.error(err);
  });
}

module.exports = {
  app,
  startServer: (serverController.start),
  stopServer: (serverController.stop)
};
