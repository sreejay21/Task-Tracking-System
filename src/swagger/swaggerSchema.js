const {badRequestResponse, unauthorizedResponse, notFoundResponse, internalServerErrorResponse} = require('./commonSchema');
const {loginSchema,profileSchema, registerSchema} = require('./authSchema');



const schemas   = {
    badRequestResponse,
    unauthorizedResponse,
    notFoundResponse,
    internalServerErrorResponse,
    registerSchema,
    loginSchema,
    profileSchema

}

module.exports = schemas;