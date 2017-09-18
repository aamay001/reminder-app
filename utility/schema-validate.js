'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const isValid = require('date-fns/is_valid');

class SchemaValidate {
  constructor(schema){
    this.schema = schema;
  }

  setSchema(providedSchema){
    schema = providedSchema;
  }

  // Checks to make sure each of the required fields
  // exists in the request body.
  validateRequiredFields(requestBody) {
    return new Promise( (resolve, reject) => {
      if(!requestBody){
        return reject({
          ok: false,
          message: 'Object missing. Empty body.'
        });
      }
      const requiredFields = Object.keys(this.schema.obj).filter( property => {
        return Object.keys(this.schema.obj[property]).includes('required');
      });
      const missingFields = requiredFields.find(field => !(field in requestBody));
      if (missingFields){
        return reject({
          ok: false,
          reason: 'Validation Error',
          message: `Required field missing: ${missingFields}`
        });
      }
      else {
        return resolve({
          ok: true
        });
      }
    });
  }

  // Check to make sure that the sent fields
  // are of the correct type.
  validateFieldTypes(requestBody) {
    return new Promise( (resolve, reject) => {
      // Get required fields so we only check the required schema field types.
      const requiredFields = Object.keys(this.schema.obj).filter( property => {
        return Object.keys(this.schema.obj[property]).includes('required');
      });

      const badTypes = Object.keys(requestBody).find( key => {
        if (requiredFields.includes(key)){
          if (this.schema.paths[key].instance === 'Date'){
            return !isValid(new Date(requestBody[key]));
          }
          return !( typeof(requestBody[key]) === (this.schema.paths[key].instance.toLowerCase()));
        }
      });

      if(badTypes){
        return reject({
          ok: false,
          reason: 'Validation Error',
          message: `Field type is invalid: ${badTypes} should be a ${this.schema.paths[badTypes].instance.toLowerCase()}.`
        });
      }
      else {
        return resolve({
          ok: true
        });
      }
    });
  }
};

module.exports = SchemaValidate;