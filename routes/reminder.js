//////////////////////
// REMINDER ROUTER
//////////////////////
'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const auth = require('../controllers/auth/auth');
const controller = require('../controllers/reminder');

router.get('/', auth.jwt, jsonParser, controller.getReminders);
router.post('/', auth.jwt, jsonParser, controller.createReminder);

module.exports = router;