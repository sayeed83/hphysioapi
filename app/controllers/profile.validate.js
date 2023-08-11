const { validationResult } = require('../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')

/**
 * Validates update profile request
 */
exports.updateProfile = [
    check('user_id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
    check('first_name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

    check('last_name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

    check('middle_name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

    check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

    check('mobile_no')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

    check('city')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

    check('state')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

    check('dob')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
    
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates change password request
 */
exports.changePassword = [
  check('oldPassword')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  check('newPassword')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.profilePhoto = [
      check('profile_photo')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),

    check('user_id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
    
    (req, res, next) => {
      validationResult(req, res, next)
    }
]

exports.updatePreferences = [
    check('preferences')
    .optional(),

  check('user_id')
  .exists()
  .withMessage('MISSING')
  .not()
  .isEmpty()
  .withMessage('IS_EMPTY')
  .trim(),
  
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
