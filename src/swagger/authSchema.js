const resgisterSchema = {
    type: 'object',
    title: 'resgisterSchema',
    properties: {
    status: {
      type: 'boolean',
      description: 'Response status'
    },
    responsecode: {
      type: 'integer',
      description: 'Response code',
      default: 201
    },
    result: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Message indicating the result of the update operation'
        }
      }
    }
  },
};

const loginSchema = {
   type: 'object',
  title: 'loginSchema',
  properties: {
    status: {
      type: 'boolean',
      description: 'Response status'
    },
     responsecode: {
      type: 'integer',
      description: 'Response code',
      default: 200
    },
    result: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Message indicating the result of the update operation'
        },
        token: {
          type: 'string',
          description: 'Token for authentication'
        }
      }
    }
  },
};

module.exports = { resgisterSchema, loginSchema };