'use strict';

require('dotenv').config();
const express = require('express');
var app = express();

const config = require('./app/config');
const serverController = require('./controllers/server');
serverController.use(app);

const auth = require('./controllers/auth');

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


///////////////////

app.use('*', (req, res) => {
  return res.status(404).json({message: 'Not Found'});
});

if (require.main === module) {
  serverController
    .start()
    .catch(err => {
    console.error(err);
    });
}

module.exports = {
  app,
  startServer: serverController.start,
  stopServer: serverController.stop
};
