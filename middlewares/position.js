const { body, check } = require('express-validator')

const fieldRequired = 'Required field not provided';
const roleRequired = 'Role can either be employee or manager';

function validate(method) {
  switch (method) {
    case 'createPosition': {
     return [ 
        check('projectname', fieldRequired).exists().notEmpty(),
        check('clientname', fieldRequired).exists().notEmpty(),
        check('role', roleRequired).exists().notEmpty().isString(),
        check('technologies', fieldRequired).exists().notEmpty(),
        check('jobdescription', fieldRequired).exists().isString().notEmpty(),
       ]   
    }
  }
}



module.exports = {
    validate,
    fieldRequired,
    roleRequired,
}