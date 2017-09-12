'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

const { app, startServer, stopServer } = require('../server');
const config = require('../app/config');

describe('Server Static Serve', function(){

  before(function(){
    return startServer(config.TEST_DATABASE_URL);
  });

  after(function(){
    return stopServer();
  });

  it('should server a static index.html page', function(){
    return chai.request(app)
      .get('/')
      .then(function(res){
        res.should.have.status(200);
        res.should.be.html;
      });
  });
});