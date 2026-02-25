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

const userSchema = {
  type: 'object',
  title: 'userSchema',
  properties: {
    status: {
      type: 'boolean',
      description: 'Response status',
      default: true
    },
    responsecode: {
      type: 'integer',
      description: 'Response code',
      default: 200
    },
    result: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          description: 'Unique user ID'
        },
        firstName: {
          type: 'string',
          description: "User's first name"
        },
        lastName: {
          type: 'string',
          description: "User's last name"
        },
        email: {
          type: 'string',
          description: "User's email address"
        },
        role: {
          type: 'string',
          description: 'Role of the user (e.g., admin, user)'
        },
        profileImage: {
          type: 'string',
          description: "URL of user's profile image"
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Timestamp when the user was created'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Timestamp when the user was last updated'
        }
      }
    }
  }
};

const roleAssignmentSchema = {
  type: 'object',
  title: 'roleAssignmentSchema',
  properties: {
    status: {
      type: 'boolean',
      description: 'Response status',
      default: true
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
          description: 'Success message indicating the role was assigned'
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Encrypted user ID'
            },
            role: {
              type: 'string',
              description: 'Updated role of the user'
            }
          }
        }
      }
    }
  }
};

module.exports = { registerSchema, loginSchema, profileSchema, userSchema, roleAssignmentSchema };

