'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = ('../controllers/auth.js');

router.post('/login', passport.authenticate('basic', {session:false}), (req,res) => {

});

module.exports = {router};

