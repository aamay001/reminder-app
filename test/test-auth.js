'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const should = chai.should();

const { app, startServer, stopServer } = require('../app');
const config = require('../app/config');

const {User} = require('../models/user');
