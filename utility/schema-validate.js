'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let schema = new mongoose.Schema();

function setSchema(providedSchema){
  schema = providedSchema;
}

// Checks to make sure each of the required fields
// exists in the request body.
function validateRequiredFields(requestBody) {
  return new Promise( (resolve, reject) => {
    const requiredFields = Object.keys(schema.obj).filter( property => {
      return Object.keys(schema.obj[property]).includes('required');
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
        ok: true,
        data: requestBody
      });
    }
  });
}

// Check to make sure that the sent fields
// are of the correct type.
function validateFieldTypes(requestBody) {
  return new Promise( (resolve, reject) => {
    const badTypes = Object.keys(requestBody).find( key => {
      return !( typeof(requestBody[key]) === schema.paths[key].instance.toLowerCase())
    });
    if(badTypes){
      return reject({
        ok: false,
        reason: 'Validation Error',
        message: `Field type is invalid: ${badTypes} should be a ${schema.paths[badTypes].instance.toLowerCase()}.`
      });
    }
    else {
      return resolve({
        ok: true,
        data: requestBody
      });
    }
  });
}

const schemaValidate = {
  setSchema : setSchema,
  validateRequiredFields: validateRequiredFields,
  validateFieldTypes: validateFieldTypes
}

module.exports = {schemaValidate};