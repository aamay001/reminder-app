'use strict';

const express = require('express');
const router = express.Router();
const { basic, jsonWebToken, createToken } = require('../controllers/auth/auth');

router.post('/login', (req,res,next) => {
    basic(req,res,next)
  },
  (req,res) => {
    const token = createToken(req.user);
    return res.json({token});
});

router.post('/refresh', (req,res,next) => {
    jsonWebToken(req,res,next);
  },
  (req,res) => {
    const token = createToken(req.user);
    return res.json({token});
});

module.exports = {router};

