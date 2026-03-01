const { body, param } = require('express-validator');
const validate = require('./validateRequest');

const createTeamValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ min: 3 })
    .withMessage('Team name must be at least 3 characters long'),
  validate
];

const addMemberValidation = [
  param('teamId')
    .notEmpty()
    .withMessage('Team ID is required in path'),
  body('userId')
    .notEmpty()
    .withMessage('User ID is required'),
  validate
];

const joinTeamValidation = [
  param('teamId')
    .notEmpty()
    .withMessage('Team ID is required in path'),
  validate
];

module.exports = {
  createTeamValidation,
  addMemberValidation,
  joinTeamValidation
};