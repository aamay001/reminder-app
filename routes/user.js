'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.get('/', (req, res) =>{
  res.status(200).json({message:"nothing to see here!"});
});

module.exports = router;