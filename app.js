'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const config = require('./app/config');
var app = express();

const serverController = require('./controllers/server');
serverController.use(app);

app.use(morgan('dev'));
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
