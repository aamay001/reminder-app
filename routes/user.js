'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {User} = require('../models/user');
const auth = require('../controllers/auth/auth');
const controller = require('../controllers/user');

router.get('/', (req, res) =>{
  res.status(200).json({message:"nothing to see here!"});
});

router.post('/', jsonParser, controller.createUser);

module.exports = router;