const {badRequestResponse, unauthorizedResponse, notFoundResponse, internalServerErrorResponse,forbiddenResponse} = require('./commonSchema');
const {loginSchema,profileSchema, registerSchema,roleAssignmentSchema,userSchema} = require('./authSchema');
const { taskSchema, createTaskResponse, listTasksResponse, assignTaskResponse, } = require('./taskSchema');

const schemas   = {
    badRequestResponse,
    unauthorizedResponse,
    forbiddenResponse,
    notFoundResponse,
    internalServerErrorResponse,
    registerSchema,
    loginSchema,
    profileSchema,
    roleAssignmentSchema,
    userSchema,
    // task related schemas
    taskSchema,
    createTaskResponse,
    listTasksResponse,
    assignTaskResponse,
}

module.exports = schemas;