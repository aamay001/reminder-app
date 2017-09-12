'use strict';

const express = require('express');
const config = require('./app/config');
const constants = require('./app/constants');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var app = express();
app.use(express.static('public'));

let server;
function startServer(database = config.DATABASE_URL) {
  return new Promise((resolve, reject) => {
    mongoose.connect(database, err => {
      if (err) {
        console.error(constants.SERVER_DB_CONNECT_ERROR(err));
        reject(err);
      }
      console.log(constants.SERVER_DB_CONNECT_SUCCESS);
      server = app.listen(config.PORT, () => {
          console.log(constants.SERVER_START_SUCCESS);
          resolve();
        })
        .on('error', err => {
          console.error(constants.SERVER_START_ERROR(err));
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function stopServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log(constants.SERVER_STOPPING);
      server.close(err => {
        if (err) {
          console.error(constants.SERVER_STOP_ERROR(err));
          return reject(err);
        }
        return resolve();
      });
    });
  });
}

if (require.main === module) {
  startServer().catch(err => {
    console.error(err);
  });
}

module.exports = { app, startServer, stopServer };
