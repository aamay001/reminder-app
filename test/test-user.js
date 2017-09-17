'use strict';

const colors = require('colors');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const should = chai.should();
const assert = chai.assert;

const {app, startServer, stopServer} = require('../app');
const config = require('../app/config');

const {User} = require('../models/user');
const testUtil = require('../utility/testutil');
const USER_ENPOINT = '/api/user';

describe('USERS'.cyan, function(){

  before(function(){
    return startServer(config.TEST_DATABASE_URL);
  });

  after(function(){
    return stopServer();
  });

  afterEach(function(){
    return testUtil.dropDatabase();
  });

  describe(USER_ENPOINT, function(){
    it('should create a new user', function(){
      let mockUser = testUtil.userFactory.createOne(false);
      mockUser.phoneNumber = config.TEST_CONFIRM_NUMBER;
      return chai.request(app)
        .post(USER_ENPOINT)
        .send(mockUser)
        .then( res => {
          res.should.have.status(201);
          res.body.username.should.deep.equal(mockUser.username);
          res.body.firstName.should.deep.equal(mockUser.firstName);
          res.body.lastName.should.deep.equal(mockUser.lastName);
          res.body.email.should.deep.equal(mockUser.email);
          res.body.phoneNumber.should.deep.equal(mockUser.phoneNumber);
          return User.findOne({username:res.body.username})
            .then( dbuser => {
              dbuser.username.should.deep.equal(mockUser.username);
              assert(dbuser.validatePassword(dbuser.password, mockUser.password) ,true);
              dbuser.firstName.should.deep.equal(mockUser.firstName);
              dbuser.lastName.should.deep.equal(mockUser.lastName);
              dbuser.email.should.deep.equal(mockUser.email);
              dbuser.phoneNumber.should.deep.equal(mockUser.phoneNumber);
              should.exist(dbuser._id);
              should.exist(dbuser.dateCreated);
              should.exist(dbuser.confirmationCode);
            })
        });
    });
  });

});