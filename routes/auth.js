//////////////////////
// AUTH ROUTER
//////////////////////
'use strict';

const express = require('express');
const router = express.Router();
const { basic, jwt, createToken } = require('../controllers/auth/auth');

router.post('/login', basic, (req,res) => {
    const token = createToken(req.user);
    return res.json({token});
});

router.post('/refresh', jwt, (req,res) => {
    const token = createToken(req.user);
    return res.json({token});
});

module.exports = {router};

