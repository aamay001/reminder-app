const config = require('./config');

module.exports = {
  SERVER_START_SUCCESS: `Server start success. Server is listening on port ${config.PORT}.`,
  SERVER_START_ERROR: err => `Server start error. Error: ${err}`,
  SERVER_STOPPING: `Server is stopping.`,
  SERVER_STOP_ERROR: err => `Server stop error. Error: ${err}`,
  SERVER_DB_CONNECT_ERROR: err => `Database connect error. Error: ${err}`,
  SERVER_DB_CONNECT_SUCCESS: `Database connect success. Connected to ${config.DATABASE_NAME}.`
};

