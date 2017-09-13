'use strict';

const PORT = process.env.PORT || 8080;
const DATABASE_NAME = 'tellmeondate';
const DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || `mongodb://localhost/${DATABASE_NAME}`;
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-tellmeondate'
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const TOKEN_EXP = process.env.TOKEN_EXP || '7d';
const DEVELOPMENT = process.env.NODE_ENV === 'dev';

module.exports = {
  PORT,
  DATABASE_NAME,
  DATABASE_URL,
  TEST_DATABASE_URL,
  TOKEN_SECRET,
  TOKEN_EXP,
  DEVELOPMENT
};