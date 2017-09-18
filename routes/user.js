//////////////////////
// USER ROUTER
//////////////////////
'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {User} = require('../models/user');
const controller = require('../controllers/user');

router.post('/', jsonParser, controller.createUser);
router.get('/', (req, res) =>{
  res.status(200).json({message:"nothing to see here!"});
});

module.exports = router;