const {badRequestResponse, unauthorizedResponse, notFoundResponse, internalServerErrorResponse} = require('./commonSchema');
const {resgisterSchema,loginSchema} = require('./authSchema');



const schemas   = {
    badRequestResponse,
    unauthorizedResponse,
    notFoundResponse,
    internalServerErrorResponse,
    resgisterSchema,
    loginSchema

}

module.exports = schemas;