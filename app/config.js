const PORT = process.env.PORT || 8080;
const DATABASE_NAME = 'tellmeondate';
const DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || `mongodb://localhost/${DATABASE_NAME}`;
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-tellmeondate'

module.exports = { PORT, DATABASE_NAME, DATABASE_URL, TEST_DATABASE_URL };