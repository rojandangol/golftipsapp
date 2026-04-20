// GolfTipsServer/src/middleware/validation.js
const { validationResult } = require('express-validator');

const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    ('\n========================================');
    ('VALIDATION ERRORS DETECTED');
    
    const fieldErrors = {};
    errors.array().forEach(error => {
      fieldErrors[error.param] = error.msg;
    });
    
    (' Error Summary:', fieldErrors);
    ('========================================\n');
    
    return res.status(400).json({
      message: 'Invalid input',
      errors: errors.array(),
      fieldErrors,
      details: `Validation failed for: ${Object.keys(fieldErrors).join(', ')}`
    });
  }
  next();
};

module.exports = { validateInput };