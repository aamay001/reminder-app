const config = require('./config');

exports.SERVER_START_SUCCESS = `Server start success. Server is listening on port ${config.PORT}.`;
exports.SERVER_START_ERROR = err => `Server start error. Error: ${err}`;
exports.SERVER_STOPPING = `Server is stopping.`
exports.SERVER_STOP_ERROR = err => `Server stop error. Error: ${err}`;