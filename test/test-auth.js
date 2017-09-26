'use strict';

const colors = require('colors');
console.info('TESTING'.magenta);

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const should = chai.should();
const assert = chai.assert;

const { app, startServer, stopServer } = require('../app');
const config = require('../app/config');

const {User} = require('../models/user');
const auth = require('../controllers/auth/auth');
const testUtil = require('../utility/testutil');
const AUTH_ENDPOINT = '/api/auth/login';

describe('AUTHENTICATION'.cyan, function(){
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
      });
  });

  afterEach(function(){
    return testUtil.dropDatabase();
  });

  describe(AUTH_ENDPOINT, function(){

    it('should prevent user logon with invalid credentials', function(){
      return chai.request(app)
        .post(AUTH_ENDPOINT)
        .send({username:'user1', password:'password'})
        .catch(err => {
          err.response.should.have.status(401);
          err.response.text.should.equal("Unauthorized");
        })
    });

    it('should allow login and provide token', function(){
      return chai.request(app)
        .post(AUTH_ENDPOINT)
        .auth(mockUser.username,mockUser.password)
        .then(res => {
          let token = res.body.authToken;
          res.should.have.status(200);
          res.body.should.be.an('object');
          assert(typeof(token),'string');
          const payload = auth.verifyToken(token);
          payload.user.should.deep.equal({
            username: mockUser.username,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName
          });
        })
    });

    it('should authenticate with jwt', function(){
      return chai.request(app)
        .post(AUTH_ENDPOINT)
        .auth(mockUser.username, mockUser.password)
        .then(res => {
          let token = res.body.authToken;
          res.should.have.status(200);
          res.body.should.be.an('object');
          assert(typeof(token),'string');
          return chai.request(app)
            .get('/api/reminder')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
              res.should.have.status(200);
              res.body.should.be.an('object');
            });
        })
    });

  });
});