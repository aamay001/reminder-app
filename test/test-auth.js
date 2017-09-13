'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const should = chai.should();

const { app, startServer, stopServer } = require('../app');
const config = require('../app/config');

const {User} = require('../models/user');
const testUtil = require('../utility/testutil');

describe('AUTHENTICATION', function(){

  before(function(){
    return startServer(config.TEST_DATABASE_URL);
  });

  after(function(){
    return stopServer();
  });

  beforeEach(function(){
    testUtil.seedDatabaseWithUsers();
  });

  afterEach(function(){
    testUtil.dropDatabase();
  });

  describe('/api/auth/login', function(){
    it('should prevent user logon', function(){
      return chai.request(app)
        .post('/api/auth/login')
        .send({username:'user1', password:'password'})
        .catch(err => {
          err.response.should.have.status(401);
          err.response.text.should.equal("Unauthorized");
        })
    });
  });

});