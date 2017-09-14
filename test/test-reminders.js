'use strict';

const colors = require('colors');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const should = chai.should();
const assert = chai.assert;

const { app, startServer, stopServer } = require('../app');
const config = require('../app/config');

const auth = require('../controllers/auth/auth');
const {Reminders} = require('../models/reminder');
const testUtil = require('../utility/testutil');
const REMINDERS_ENPOINT = '/api/reminder';
const AUTH_ENDPOINT = '/api/auth/login';

describe('REMINDERS'.cyan, function(){
  let mockUser;

  before(function(){
    return startServer(config.TEST_DATABASE_URL);
  });

  after(function(){
    return stopServer();
  });

  beforeEach(function(){
    return testUtil.seedDatabaseWithUser()
      .then(user => {
        mockUser = user;
        return testUtil.seedDatabaseWithReminders(mockUser._id.toString());
      })
  });

  afterEach(function(){
    return testUtil.dropDatabase();
  });

  describe(REMINDERS_ENPOINT, function(){
    it('should return all reminders', function(){
      return chai.request(app)
        .post(AUTH_ENDPOINT)
        .auth(mockUser.username, mockUser.password)
        .then(res => {
          let token = res.body.authToken;
          res.should.have.status(200);
          return chai.request(app)
            .get(REMINDERS_ENPOINT)
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
              res.should.have.status(200);
              res.body.should.be.an('array');
              res.body.length.should.equal(5);
            })
        })
    });
  })
});

