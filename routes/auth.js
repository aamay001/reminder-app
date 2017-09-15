//////////////////////
// AUTH ROUTER
//////////////////////
'use strict';

const express = require('express');
const router = express.Router();
const { basic, jwt, createToken } = require('../controllers/auth/auth');

router.post('/login', basic, (req,res) => {
  if (! req.user.ok ){
    return res.status(401).json(req.user);
  }
  const authToken = createToken(req.user.apiGet());
  return res.json({authToken});
});

router.post('/refresh', jwt, (req,res) => {
  const authToken = createToken(req.user.apiGet());
  return res.json({authToken});
});

module.exports = {router};

