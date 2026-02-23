const registerSchema = {
    type: 'object',
    title: 'registerSchema',
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

const profileSchema = {
    type: 'object',
    title: 'profileSchema',
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
        firstName: {
            type: 'string',
            description: 'First name of the user'
        },
        lastName: {
            type: 'string',
            description: 'Last name of the user'
        },
        email: {
            type: 'string',
            description: 'Email of the user'
        },
        profileImage:{
            type:'string'
        }
        }
    }
    },
};

module.exports = { registerSchema, loginSchema, profileSchema };