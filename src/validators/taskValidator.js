const { body,param } = require('express-validator');
const validate = require('./validateRequest')

const createTaskValidation = [
    
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),

    body('dueDate')
        .notEmpty()
        .withMessage('Due date is required')
        .isISO8601()
        .withMessage('Due date must be a valid date')
        .custom((value) => {
            const today = new Date();
            const due = new Date(value);
            if (due < today) {
                throw new Error('Due date must be in the future');
            }
            return true;
        }),
    validate
];

const assignTaskValidation = [
    param('taskId')
        .notEmpty()
        .withMessage('Task ID is required as Query param'),
    body('assignedTo')
        .isArray({ min: 1 })
        .withMessage('assignedTo must be a non-empty array'),
    validate
];

module.exports = {
    createTaskValidation,
    assignTaskValidation
}