const { body } = require('express-validator');
const validate = require('./validateRequest')


const registerValidation = [
  body('firstName')
    .notEmpty().withMessage('First name is required'),
  body('lastName')
    .notEmpty().withMessage('Last name is required'),
  body('email')
    .isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate
];


const loginValidation = [
  body('email')
    .isEmail().withMessage('Valid email is required'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];


const assignRoleValidation = [
  body('userid') 
    .notEmpty().withMessage('User ID is required'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['Admin', 'User'])
    .withMessage('Invalid role'),
  validate
];


module.exports = {
  registerValidation,
  loginValidation,
  assignRoleValidation
};