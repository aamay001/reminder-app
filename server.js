const express = require('express');
const config = require('./app/config');
const constants = require('./app/constants');
const reload = require('reload');

var app = express();
app.use(express.static('public'));

reload(app);

let server;
function startServer(){
  return new Promise((resolve, reject) => {
    server = app.listen(config.PORT, () => {
      console.log(constants.SERVER_START_SUCCESS);
      resolve();
    })
    .on('error', err => {
      console.error(constants.SERVER_START_ERROR(err));
      reject(err);
    });
  });
}

function stopServer(){
  return new Promise((resolve, reject) => {
    console.log(constants.SERVER_STOPPING);
    server.close(err => {
      if(err){
        console.error(constants.SERVER_STOP_ERROR(err));
        return reject(err);
      }
      return resolve();
    });
  });
}

if (require.main === module){
  startServer().catch(err => {
    console.error(err);
  });
}

module.exports = { app, startServer, stopServer };


