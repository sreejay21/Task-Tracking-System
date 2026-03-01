const { body, param } = require('express-validator');
const validate = require('./validateRequest');

const commentValidation = [
  param('taskId')
    .notEmpty()
    .withMessage('Task ID is required in path'),
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Comment text is required'),
  validate
];

const attachmentValidation = [
  param('taskId')
    .notEmpty()
    .withMessage('Task ID is required in path'),
  body('filename')
    .trim()
    .notEmpty()
    .withMessage('Filename is required'),
  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required'),
  validate
];

const aiValidation = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Input text is required for AI generation'),
  validate
];

module.exports = {
  commentValidation,
  attachmentValidation
  ,
  aiValidation
};