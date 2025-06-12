import { body, validationResult } from 'express-validator';
import { createResponse } from '../utils/helpers.js';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      createResponse(false, 'Validation failed', null, errors.array())
    );
  }
  next();
};

// User profile validation
export const validateUserProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(), // optional: sanitize input to prevent injection/XSS
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .isLength({ max: 255 }) // enforce max length for email
    .withMessage('Email must be at most 255 characters'),
  handleValidationErrors,
];
