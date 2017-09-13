'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 32,
    minlength: 4
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    unique = true,
    required = true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  confirmed: {
    type: boolean,
    default: false
  }
});

UserSchema.methods.apiGet = function(){
  return {
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phoneNumber: this.phoneNumber
  };
}

UserSchema.methods.validatePassword = function(password){
  return bcrypt.compare(password, this.password);
}

UserSchema.statics.securePassword = function(password){
  return bcrypt.hash(password, 11);
}

const User = mongoose.model('User', UserSchema);

module.exports = {User};
