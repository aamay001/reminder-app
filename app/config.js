'use strict';

const PORT = process.env.PORT || 8000;
const DATABASE_NAME = 'tellmeondate';
const DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || `mongodb://localhost/${DATABASE_NAME}`;
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-tellmeondate'
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const TOKEN_EXP = process.env.TOKEN_EXP || '7d';

function CORS(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
      return res.send(204);
  }
  next();
};

module.exports = {
  PORT,
  DATABASE_NAME,
  DATABASE_URL,
  TEST_DATABASE_URL,
  TOKEN_SECRET,
  TOKEN_EXP,
  CORS: CORS
};