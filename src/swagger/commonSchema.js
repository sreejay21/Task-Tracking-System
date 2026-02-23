const forbiddenResponse = {
  type: 'object',
  title: 'forbiddenResponse',
  properties: {
    status: {
      type: 'boolean',
      description: 'Response status'
    },
    responsecode: {
      type: 'integer',
      description: 'Response code',
      default: 403
    },
    message: {
      type: 'object',
      description: 'Response message'
    }
  }
}

const internalServerErrorResponse = {
  type: 'object',
  title: 'internalServerErrorResponse',
  properties: {
    status: {
      type: 'boolean',
      description: 'Response status'
    },
    responsecode: {
      type: 'integer',
      description: 'Response code',
      default: 500
    },
    message: {
      type: 'object',
      description: 'Response message'
    }
  }
}

const notFoundResponse = {
  type: 'object',
  title: 'notFoundResponse',
  properties: {
    status: {
      type: 'boolean',
      description: 'Response status'
    },
    responsecode: {
      type: 'integer',
      description: 'Response code',
      default: 404
    },
    message: {
      type: 'object',
      description: 'Response message'
    }
  }
}

const unauthorizedResponse = {
  type: 'object',
  title: 'unauthorizedResponse',
  properties: {
    status: {
      type: 'boolean',
      description: 'Response status'
    },
    responsecode: {
      type: 'integer',
      description: 'Response code',
      default: 401
    },
    message: {
      type: 'object',
      description: 'Response message'
    }
  }
}

const badRequestResponse = {
  type: 'object',
  title: 'badRequestResponse',
  properties: {
    status: {
      type: 'boolean',
      description: 'Response status'
    },
    responsecode: {
      type: 'integer',
      description: 'Response code',
      default: 400
    },
    message: {
      type: 'object',
      description: 'Response message'
    }
  }
}



module.exports = { forbiddenResponse, internalServerErrorResponse, notFoundResponse, unauthorizedResponse, badRequestResponse }
