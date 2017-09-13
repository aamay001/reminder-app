'use strict';

const config = require('../app/config');
const constants = require('../app/constants');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var _app;
var _server;

function use(app){
  _app = app;
}

function start(database = config.DATABASE_URL) {
  return new Promise((resolve, reject) => {
    mongoose.connect(database, err => {
      if (err) {
        console.error(constants.SERVER_DB_CONNECT_ERROR(err));
        reject(err);
      }
      console.log(constants.SERVER_DB_CONNECT_SUCCESS);
      _server = _app.listen(config.PORT, () => {
          console.log(constants.SERVER_START_SUCCESS);
          resolve(_server);
        })
        .on('error', err => {
          console.error(constants.SERVER_START_ERROR(err));
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function stop() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log(constants.SERVER_STOPPING);
      _server.close(err => {
        if (err) {
          console.error(constants.SERVER_STOP_ERROR(err));
          return reject(err);
        }
        return resolve();
      });
    });
  });
}

function cors(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
      return res.send(204);
  }
  next();
};

module.exports = {stop, start, use, cors};