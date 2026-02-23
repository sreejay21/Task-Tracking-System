const swaggerJsdoc = require('swagger-jsdoc');
const swaggerSchemas = require('./swaggerSchema')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Tracking API',
      version: '1.0.0',
      description: 'API documentation for Task Tracking System'
    },
    servers: [
      {
        url: 'http://localhost:5000/api'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: swaggerSchemas
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;